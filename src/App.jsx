import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChartLine,
  ChatCircle,
  Heart,
  House,
  MoonStars,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Users,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  INITIAL_PROFILE,
  PEER_CIRCLES,
  analyzeWellness,
  buildSaathiReply,
  createJournalEntry,
  createSeedEntries,
  createSeedMessages,
  createSeedRequests,
  formatDateRange,
  getScaleSignalCoverage,
  getSupportState,
  getTimeWindowSeries,
  summarizeEntry,
} from "./lib/wellness";

const STORAGE_KEYS = {
  entries: "examsathi.entries",
  messages: "examsathi.messages",
  requests: "examsathi.requests",
};

const VIEW_SCREENS = [
  { id: "home", label: "Home" },
  { id: "checkin", label: "Check-in" },
  { id: "insights", label: "Insights" },
  { id: "community", label: "Community" },
  { id: "safety", label: "Safety" },
];

const SCREEN_COPY = {
  home: {
    title: "How are you, really?",
    subtitle: "Talk it through privately. Saathi responds using your own check-ins and recent conversation—not invented patterns.",
  },
  checkin: {
    title: "A two-minute check-in.",
    subtitle: "Capture sleep, stress, mood, and what happened. Every saved entry updates your patterns immediately.",
  },
  insights: {
    title: "See patterns, not verdicts.",
    subtitle: "Understand when stress rose, what appeared around it, and which next step is supported by your logs.",
  },
  community: {
    title: "Support beyond the screen.",
    subtitle: "Find students preparing for the same exam or request a confidential conversation with a therapist.",
  },
  safety: {
    title: "When patterns persist, support steps in.",
    subtitle: "Review the 3-day warning and 7-day critical pathway, then choose what gets shared and with whom.",
  },
};

const inMemoryStorage = new Map();

const INITIAL_JOURNAL_FORM = {
  date: new Date().toISOString().slice(0, 10),
  checkInTime: "20:30",
  stress: "3",
  sleepHours: "6.5",
  mood: "Steady",
  studyTime: "21:00",
  note: "",
};

const MOOD_OPTIONS = [
  "Calm",
  "Steady",
  "Tense",
  "Worried",
  "Drained",
  "Overloaded",
  "Recovering",
];

function getInitialScreen() {
  if (typeof window === "undefined") {
    return "home";
  }

  const hash = window.location.hash.replace("#", "").toLowerCase();
  return VIEW_SCREENS.some((screen) => screen.id === hash) ? hash : "home";
}

const createId = (prefix) =>
  `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)}`;

function readStoredValue(key, fallbackFactory) {
  const storage = getStorage();

  try {
    const stored = storage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage errors and fall back to seeded data.
  }

  return typeof fallbackFactory === "function" ? fallbackFactory() : fallbackFactory;
}

function getStorage() {
  if (typeof window !== "undefined") {
    const storage = window.localStorage;
    if (
      storage &&
      typeof storage.getItem === "function" &&
      typeof storage.setItem === "function" &&
      typeof storage.removeItem === "function"
    ) {
      return storage;
    }
  }

  return {
    getItem(key) {
      return inMemoryStorage.has(key) ? inMemoryStorage.get(key) : null;
    },
    setItem(key, value) {
      inMemoryStorage.set(key, value);
    },
    removeItem(key) {
      inMemoryStorage.delete(key);
    },
  };
}

function usePersistentState(key, fallbackFactory) {
  const [value, setValue] = useState(() => readStoredValue(key, fallbackFactory));

  useEffect(() => {
    try {
      getStorage().setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write failures; the app still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}

function formatHours(value) {
  return `${Number(value).toFixed(1)}h`;
}

function formatCounter(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function ChatMessage({ role, text, createdAt }) {
  return (
    <div className={`chat-message ${role}`}>
      <div className="chat-meta">
        <strong>{role === "assistant" ? "Saathi" : "You"}</strong>
        <span>{createdAt}</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

function MetricCard({ label, value, subtext }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{subtext}</p>
    </article>
  );
}

function Panel({ eyebrow, title, icon, children, className = "" }) {
  return (
    <article className={`panel ${className}`.trim()}>
      <div className="panel-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        {icon}
      </div>
      {children}
    </article>
  );
}

export function App() {
  const [entries, setEntries] = usePersistentState(
    STORAGE_KEYS.entries,
    createSeedEntries,
  );
  const [messages, setMessages] = usePersistentState(
    STORAGE_KEYS.messages,
    createSeedMessages,
  );
  const [requests, setRequests] = usePersistentState(
    STORAGE_KEYS.requests,
    createSeedRequests,
  );
  const [activeScreen, setActiveScreen] = useState(getInitialScreen);
  const [toast, setToast] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [journalForm, setJournalForm] = useState(INITIAL_JOURNAL_FORM);
  const [peerExam, setPeerExam] = useState(INITIAL_PROFILE.exam);
  const [peerNote, setPeerNote] = useState("");
  const [therapistNote, setTherapistNote] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => setActiveScreen(getInitialScreen());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigateToScreen(screen) {
    setActiveScreen(screen);
    if (typeof window !== "undefined") {
      window.location.hash = screen;
    }
  }

  const analysis = useMemo(() => analyzeWellness(entries), [entries]);
  const supportState = useMemo(() => getSupportState(analysis), [analysis]);
  const timeline = useMemo(() => getTimeWindowSeries(analysis.recent), [analysis.recent]);
  const scaleCoverage = useMemo(() => getScaleSignalCoverage(entries), [entries]);
  const peerExamOptions = useMemo(
    () => ["All exams", ...new Set(PEER_CIRCLES.map((circle) => circle.exam))],
    [],
  );
  const visiblePeerCircles =
    peerExam === "All exams"
      ? PEER_CIRCLES
      : PEER_CIRCLES.filter((circle) => circle.exam === peerExam);
  const latestEntry = useMemo(() => {
    if (!entries.length) {
      return null;
    }

    return [...entries].sort((left, right) => new Date(left.date) - new Date(right.date)).at(-1);
  }, [entries]);

  useEffect(() => {
    if (chatEndRef.current && typeof chatEndRef.current.scrollIntoView === "function") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(message) {
    setToast(message);
  }

  function appendChatMessage(text) {
    const userMessage = {
      id: createId("msg"),
      role: "user",
      text,
      createdAt: new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    const assistantMessage = {
      id: createId("msg"),
      ...buildSaathiReply(text, analysis, messages),
      createdAt: "now",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
  }

  function handleChatSubmit(event) {
    event.preventDefault();
    const value = chatInput.trim();
    if (!value) {
      return;
    }

    appendChatMessage(value);
    setChatInput("");
    showToast("Saathi responded with an evidence-based reply.");
  }

  function handleQuickPrompt(prompt) {
    setChatInput(prompt);
    appendChatMessage(prompt);
    setChatInput("");
  }

  function handleJournalSubmit(event) {
    event.preventDefault();

    if (!journalForm.note.trim()) {
      showToast("Please add a short note before saving the check-in.");
      return;
    }

    const entry = createJournalEntry(journalForm);
    const nextEntries = [entry, ...entries];
    const nextAnalysis = analyzeWellness(nextEntries);
    const assistantReply = buildSaathiReply(entry.note, nextAnalysis, messages);

    setEntries(nextEntries);
    setMessages((current) => [
      ...current,
      {
        id: createId("msg"),
        role: "user",
        text: `Saved a ${entry.mood.toLowerCase()} check-in for ${entry.date}.`,
        createdAt: "now",
      },
      {
        id: createId("msg"),
        ...assistantReply,
        createdAt: "now",
      },
    ]);
    setJournalForm({
      ...INITIAL_JOURNAL_FORM,
      date: new Date().toISOString().slice(0, 10),
    });
    showToast("Check-in saved and patterns updated.");
  }

  function handleSendParentAlert() {
    const alertRequest = {
      id: createId("request"),
      type: "parent",
      title: supportState.label,
      detail: supportState.message,
      status: "Pending",
      createdAt: new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setRequests((current) => [alertRequest, ...current]);
    showToast("Parent alert prepared for review.");
  }

  function handlePeerConnect(circle) {
    const request = {
      id: createId("request"),
      type: "peer",
      title: circle.title,
      detail: `${circle.exam} · ${peerNote || "Peer support requested"}`,
      status: "Pending",
      createdAt: new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setRequests((current) => [request, ...current]);
    setPeerNote("");
    showToast(`Request to join the ${circle.exam} circle was saved.`);
  }

  function handleTherapistConnect() {
    const request = {
      id: createId("request"),
      type: "therapist",
      title: "Therapist connect",
      detail: therapistNote || "Confidential session requested.",
      status: "Pending",
      createdAt: new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setRequests((current) => [request, ...current]);
    setTherapistNote("");
    showToast("Therapist request added to the support queue.");
  }

  const requestCount = requests.length;
  const flags = [
    {
      label: "Avg stress",
      value: `${analysis.avgStress.toFixed(1)}/5`,
      subtext: "From the last 7 entries",
    },
    {
      label: "Avg sleep",
      value: formatHours(analysis.avgSleep),
      subtext: "Based on self-reported sleep",
    },
    {
      label: "Issue streak",
      value: formatCounter(analysis.issueStreak, "day"),
      subtext: "Consecutive poor-signal days",
    },
    {
      label: "Top trigger",
      value: analysis.topTriggerLabel || "None yet",
      subtext: "Most repeated pattern",
    },
  ];

  return (
    <main className="app-shell">
      <section className="backdrop" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grid-mask" />
      </section>

      <div className="app-frame">
        <nav className="bottom-nav top-nav" aria-label="Primary navigation">
          {VIEW_SCREENS.map((screen) => {
            const Icon = {
              home: House,
              checkin: Heart,
              insights: ChartLine,
              community: Users,
              safety: WarningCircle,
            }[screen.id];

            return (
              <button
                key={screen.id}
                type="button"
                className={`nav-item ${activeScreen === screen.id ? "active" : ""}`}
                onClick={() => navigateToScreen(screen.id)}
                aria-current={activeScreen === screen.id ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{screen.label}</span>
              </button>
            );
          })}
        </nav>

        <header className="topbar">
          <div className="hero-copy-block">
            <p className="eyebrow">ExamSathi</p>
            <h1>{SCREEN_COPY[activeScreen].title}</h1>
            <p className="hero-subtitle">{SCREEN_COPY[activeScreen].subtitle}</p>
          </div>

          <div className="status-stack">
            <div className={`alert-pill ${supportState.tone}`}>
              <WarningCircle size={18} weight="fill" />
              <span>{supportState.label}</span>
            </div>
            <div className="status-note">{supportState.message}</div>
            <div className="account-row" aria-label="Signed-in profile and privacy status">
              <div className="privacy-chip">
                <ShieldCheck size={17} />
                Private on this device
              </div>
              <div className="profile-chip" aria-label={`${INITIAL_PROFILE.name}, ${INITIAL_PROFILE.exam}`}>
                <span>{INITIAL_PROFILE.name.slice(0, 1)}</span>
                <div>
                  <strong>{INITIAL_PROFILE.name}</strong>
                  <small>{INITIAL_PROFILE.exam}</small>
                </div>
              </div>
            </div>
          </div>
        </header>

        {activeScreen === "home" ? <section className="hero-card">
          <div className="assistant-card">
            <div className="assistant-head">
              <div>
                <p className="assistant-name">Saathi</p>
                <p className="assistant-meta">
                  Private, conversation-led, and grounded in the student’s own data
                </p>
              </div>
              <LockIcon />
            </div>

            <div className="chat-thread" aria-live="polite">
              {messages.slice(-5).map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  text={message.text}
                  createdAt={message.createdAt}
                />
              ))}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-composer" onSubmit={handleChatSubmit}>
              <label className="field">
                <span>Talk to Saathi</span>
                <textarea
                  rows="3"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Tell me what feels heavy today..."
                />
              </label>

              <div className="quick-prompts" aria-label="Quick prompts">
                {[
                  "Before a mock",
                  "I feel behind",
                  "I stayed up late",
                  "I cannot focus",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="prompt-chip"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <button type="submit" className="primary-button">
                Send to Saathi
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <div className="hero-side">
            <div className="metric-grid">
              {flags.map((flag) => (
                <MetricCard key={flag.label} {...flag} />
              ))}
            </div>

            <div className="support-banner">
              <div>
                <p className="eyebrow">Evidence-only summary</p>
                <h2>
                  {analysis.topTriggerLabel
                    ? `The strongest pattern right now is ${analysis.topTriggerLabel.toLowerCase()}.`
                    : "No repeating pattern yet."}
                </h2>
                <p>
                  Analysis window: {formatDateRange(analysis.recent)}. The weekly update and
                  Saathi replies are generated only from those logs.
                </p>
                <p className="support-banner-note">
                  Latest log: {latestEntry ? summarizeEntry(latestEntry) : "No check-in yet."}
                </p>
              </div>
              <MoonStars size={24} />
            </div>

            <div className="signal-card">
              <div className="card-head">
                <div>
                  <p className="eyebrow">Signals</p>
                  <h3>Stress and sleep trend</h3>
                </div>
                <ChartLine size={22} />
              </div>

              <div className="signal-bars" role="img" aria-label="Stress and sleep trend for the last seven logs">
                {timeline.map((item) => (
                  <div key={item.id} className="signal-day">
                    <div className="bars">
                      <span className="bar stress" style={{ height: `${item.stress * 16}%` }} />
                      <span className="bar sleep" style={{ height: `${item.sleep * 12}%` }} />
                    </div>
                    <span>{item.day}</span>
                    <small>{item.timeWindow}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> : null}

        {activeScreen === "checkin" ? (
          <section className="dashboard-grid">
            <Panel
              eyebrow="Daily check-in"
              title="Save a new journal entry"
              icon={<Heart size={22} />}
              className="panel-wide"
            >
              <form className="journal-form" onSubmit={handleJournalSubmit}>
                <div className="form-grid">
                  <label className="field">
                    <span>Date</span>
                    <input
                      type="date"
                      value={journalForm.date}
                      onChange={(event) =>
                        setJournalForm((current) => ({ ...current, date: event.target.value }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Check-in time</span>
                    <input
                      type="time"
                      value={journalForm.checkInTime}
                      onChange={(event) =>
                        setJournalForm((current) => ({
                          ...current,
                          checkInTime: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Stress level</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={journalForm.stress}
                      onChange={(event) =>
                        setJournalForm((current) => ({ ...current, stress: event.target.value }))
                      }
                    />
                    <strong>{journalForm.stress}/5</strong>
                  </label>

                  <label className="field">
                    <span>Sleep last night</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={journalForm.sleepHours}
                      onChange={(event) =>
                        setJournalForm((current) => ({
                          ...current,
                          sleepHours: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Study time</span>
                    <input
                      type="time"
                      value={journalForm.studyTime}
                      onChange={(event) =>
                        setJournalForm((current) => ({ ...current, studyTime: event.target.value }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Mood</span>
                    <select
                      value={journalForm.mood}
                      onChange={(event) =>
                        setJournalForm((current) => ({ ...current, mood: event.target.value }))
                      }
                    >
                      {MOOD_OPTIONS.map((mood) => (
                        <option key={mood}>{mood}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="field">
                  <span>What happened today?</span>
                  <textarea
                    rows="4"
                    value={journalForm.note}
                    onChange={(event) =>
                      setJournalForm((current) => ({ ...current, note: event.target.value }))
                    }
                    placeholder="Example: Compared mock scores, stayed up late, then felt tired this morning."
                  />
                </label>

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    Save check-in
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigateToScreen("insights")}
                  >
                    Review patterns
                  </button>
                </div>
              </form>
            </Panel>

            <Panel
              eyebrow="Recent logs"
              title="What has been saved"
              icon={<ChatCircle size={22} />}
            >
              <div className="entry-list">
                {entries.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="entry-card">
                    <strong>{entry.mood}</strong>
                    <p>{summarizeEntry(entry)}</p>
                    <span>{entry.note}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </section>
        ) : null}

        {activeScreen === "insights" ? (
          <section className="dashboard-grid">
            <Panel
              eyebrow="Weekly insight"
              title="Stress, sleep, and trigger breakdown"
              icon={<ChartLine size={22} />}
              className="panel-wide"
            >
              <div className="weekly-copy">
                {analysis.weeklySummary.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>

              <div className="evidence-grid">
                {Object.entries(analysis.triggerCounts).map(([key, value]) => (
                  <div key={key} className="evidence-card">
                    <span>{key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              eyebrow="Conversational assessment"
              title="Scale signals found in your own words"
              icon={<ChatCircle size={22} />}
              className="panel-wide"
            >
              <p className="assessment-note">
                These are evidence-coverage indicators, not clinical scores or a diagnosis. A
                complete assessment still requires every question and its frequency response.
              </p>
              <div className="scale-grid">
                {scaleCoverage.map((scale) => (
                  <article key={scale.id} className="scale-card">
                    <div className="scale-card-head">
                      <div>
                        <p className="eyebrow">{scale.window}</p>
                        <h4>{scale.name}</h4>
                      </div>
                      <strong>{scale.matchedItems}/{scale.totalItems}</strong>
                    </div>
                    <div
                      className="coverage-track"
                      role="progressbar"
                      aria-label={`${scale.name} evidence coverage`}
                      aria-valuenow={scale.coverage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span style={{ width: `${scale.coverage}%` }} />
                    </div>
                    <p>
                      {scale.evidence.length
                        ? `Possible signals: ${scale.evidence.join("; ")}.`
                        : "No matching signal has been logged yet."}
                    </p>
                  </article>
                ))}
              </div>
            </Panel>

            <Panel
              eyebrow="Pattern notes"
              title="What the app can say safely"
              icon={<ShieldCheck size={22} />}
            >
              <div className="checklist">
                <div className="check-item">
                  {analysis.issueStreak >= 3
                    ? "Warning state is active because poor sleep or stress has stayed elevated for several days."
                    : "Warning state is still stable because the current streak is under three days."}
                </div>
                <div className="check-item">
                  {analysis.topTriggerLabel
                    ? `The strongest trigger is ${analysis.topTriggerLabel.toLowerCase()}, backed by the student’s own notes.`
                    : "No trigger is labeled yet, so the app stays cautious about claims."}
                </div>
                <div className="check-item">
                  {analysis.recommendation}
                </div>
              </div>
            </Panel>

            <Panel
              eyebrow="Evidence"
              title="Recent trigger examples"
              icon={<MoonStars size={22} />}
            >
              <div className="entry-list compact">
                {Object.entries(analysis.triggerExamples).map(([key, values]) => (
                  <div key={key} className="entry-card">
                    <strong>{key}</strong>
                    <p>{values.length ? values[0] : "No example yet"}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </section>
        ) : null}

        {activeScreen === "community" ? (
          <section className="dashboard-grid">
            <Panel
              eyebrow="Peer support"
              title="Connect with students for the same exam"
              icon={<Users size={22} />}
              className="panel-wide"
            >
              <div className="form-grid compact-grid">
                <label className="field">
                  <span>Exam group</span>
                  <select value={peerExam} onChange={(event) => setPeerExam(event.target.value)}>
                    {peerExamOptions.map((exam) => (
                      <option key={exam}>{exam}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Peer note</span>
                  <input
                    type="text"
                    value={peerNote}
                    onChange={(event) => setPeerNote(event.target.value)}
                    placeholder="Example: Need a calm mock-test review group."
                  />
                </label>
              </div>

              <div className="peer-grid">
                {visiblePeerCircles.map((circle) => (
                  <div key={circle.title} className="community-card">
                    <div className="community-meta">{circle.members}</div>
                    <h4>{circle.title}</h4>
                    <p>{circle.summary}</p>
                    <p className="community-footnote">Exam: {circle.exam}</p>
                    <button type="button" className="support-button" onClick={() => handlePeerConnect(circle)}>
                      Request to join
                    </button>
                  </div>
                ))}
                {!visiblePeerCircles.length ? (
                  <div className="empty-state">
                    No circles match this exam yet. Switch to another group or show all exams.
                  </div>
                ) : null}
              </div>
            </Panel>

            <Panel
              eyebrow="Therapist connect"
              title="Request a professional session"
              icon={<Stethoscope size={22} />}
            >
              <label className="field">
                <span>What should the therapist know?</span>
                <textarea
                  rows="4"
                  value={therapistNote}
                  onChange={(event) => setTherapistNote(event.target.value)}
                  placeholder="Example: Sleep has been poor for 4 days and comparison is making study harder."
                />
              </label>

              <button type="button" className="primary-button full" onClick={handleTherapistConnect}>
                Request therapist connect
              </button>
            </Panel>
          </section>
        ) : null}

        {activeScreen === "safety" ? (
          <section className="dashboard-grid">
            <Panel
              eyebrow="Safety routing"
              title="Parent warning and escalation"
              icon={<WarningCircle size={22} />}
            >
              <div className="warning-card">
                <p className="warning-title">{supportState.label}</p>
                <p>{supportState.message}</p>
              </div>

              <div className="status-row">
                <div>
                  <span>Issue streak</span>
                  <strong>{formatCounter(analysis.issueStreak, "day")}</strong>
                </div>
                <div>
                  <span>Requests</span>
                  <strong>{requestCount}</strong>
                </div>
              </div>

              <button type="button" className="ghost-button" onClick={handleSendParentAlert}>
                Prepare parent alert
                <ArrowRight size={16} />
              </button>
            </Panel>

            <Panel
              eyebrow="Support queue"
              title="Requests and follow-ups"
              icon={<PhoneCall size={22} />}
              className="panel-wide"
            >
              <div className="entry-list compact">
                {requests.length ? (
                  requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="entry-card">
                      <strong>{request.title}</strong>
                      <p>{request.detail}</p>
                      <span>
                        {request.type} · {request.status} · {request.createdAt}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    No support requests yet. Trigger a peer, therapist, or parent action to see it here.
                  </div>
                )}
              </div>
            </Panel>
          </section>
        ) : null}

        <footer className="product-footer">
          <div>
            <strong>ExamSathi</strong>
            <span>Private, evidence-aware support for exam preparation.</span>
          </div>
          <p>
            ExamSathi supports reflection and early intervention; it does not provide a medical
            diagnosis. In an emergency, contact local emergency services or a trusted adult.
          </p>
        </footer>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}

export function resetPersistentStore() {
  inMemoryStorage.clear();
  if (typeof window !== "undefined") {
    window.location.hash = "";
  }
}

function LockIcon() {
  return (
    <div className="lock-icon" aria-hidden="true">
      <ShieldCheck size={20} />
    </div>
  );
}
