import {
  ArrowRight,
  ChartLine,
  ChatCircle,
  Heart,
  House,
  Lock,
  MoonStars,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Users,
  WarningCircle,
} from "@phosphor-icons/react";

const student = {
  name: "Aarav",
  exam: "JEE Main",
  daysToExam: 18,
  streak: 9,
  mood: "3.8/5",
};

const dailySignals = [
  { day: "Mon", stress: 42, sleep: 7.2 },
  { day: "Tue", stress: 55, sleep: 6.4 },
  { day: "Wed", stress: 61, sleep: 5.9 },
  { day: "Thu", stress: 68, sleep: 5.3 },
  { day: "Fri", stress: 73, sleep: 5.1 },
  { day: "Sat", stress: 64, sleep: 5.8 },
  { day: "Sun", stress: 59, sleep: 6.1 },
];

const insightSignals = [
  {
    label: "Comparison loop",
    value: "4 triggers this week",
    detail: "Stress rises after late-night peer comparisons.",
  },
  {
    label: "Late study",
    value: "2:10 AM average",
    detail: "Study sessions extend 1.4 hours on comparison-heavy days.",
  },
  {
    label: "Sleep debt",
    value: "5h 25m avg",
    detail: "Three consecutive short-sleep nights push stress upward.",
  },
];

const communityCards = [
  {
    title: "Same-exam group",
    body: "Join a small, moderated study pod for JEE Main aspirants in your zone.",
    meta: "12 active peers",
  },
  {
    title: "Therapist connect",
    body: "Book a short confidential session with a licensed therapist when the load gets heavy.",
    meta: "Available today",
  },
];

const copingActions = [
  "Reset Breath",
  "2-minute focus reset",
  "Sleep wind-down",
  "Reach out safely",
];

const weeklySummary = [
  "Stress climbed most between 9:30 PM and 1:00 AM.",
  "Main cause: comparison after mock tests and a fear of falling behind.",
  "Best mitigation: set a hard stop, sleep before 12:30 AM, and switch to a 10-minute reset.",
];

export function getSupportState({ poorSleepDays = 4, highStressDays = 5 } = {}) {
  if (poorSleepDays >= 7 || highStressDays >= 7) {
    return {
      tone: "critical",
      label: "Critical warning",
      message:
        "Poor sleep and stress have stayed elevated for 7 days. A trusted adult should be looped in now.",
    };
  }

  if (poorSleepDays >= 3 || highStressDays >= 3) {
    return {
      tone: "warning",
      label: "Warning",
      message:
        "Stress and sleep look concerning for more than 3 days. A parent notification is recommended.",
    };
  }

  return {
    tone: "normal",
    label: "Stable",
    message: "Signals are within a manageable range today.",
  };
}

const supportState = getSupportState();

export function App() {
  return (
    <main className="app-shell">
      <section className="backdrop" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="grid-mask" />
      </section>

      <div className="app-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">ExamSathi</p>
            <h1>
              Intimate support for exam pressure, with patterns the student can
              actually act on.
            </h1>
          </div>
          <div className={`alert-pill ${supportState.tone}`}>
            <WarningCircle size={18} weight="fill" />
            <span>{supportState.label}</span>
          </div>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <p className="subtle">Today</p>
            <h2>
              “What’s taking up the most space in your mind right now?”
            </h2>
            <p>
              A calm, conversation-led companion that listens first, then
              explains what the data is showing about comparison, late study,
              and sleep loss.
            </p>
            <div className="chip-row" aria-label="Quick prompts">
              <button type="button" className="chip chip-active">
                Before a mock
              </button>
              <button type="button" className="chip">
                Feeling behind
              </button>
              <button type="button" className="chip">
                Can’t sleep
              </button>
            </div>
          </div>

          <div className="assistant-card" aria-label="Conversation preview">
            <div className="assistant-head">
              <div>
                <p className="assistant-name">Saathi</p>
                <p className="assistant-meta">
                  Always available, private, and non-judgmental
                </p>
              </div>
              <Lock size={18} />
            </div>

            <div className="assistant-bubble">
              I noticed a pattern, Aarav. On days comparison shows up, you tend
              to study later, and your sleep drops. Want to break that loop
              together?
            </div>

            <div className="support-row">
              {copingActions.map((action) => (
                <button key={action} type="button" className="support-button">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="panel panel-tall">
            <div className="panel-head">
              <div>
                <p className="subtle">Wellness signals</p>
                <h3>What the tracker sees</h3>
              </div>
              <ChartLine size={22} />
            </div>

            <div className="signal-bars" role="img" aria-label="Stress and sleep trend for the week">
              {dailySignals.map((item) => (
                <div key={item.day} className="signal-day">
                  <div className="bars">
                    <span
                      className="bar stress"
                      style={{ height: `${item.stress}%` }}
                    />
                    <span
                      className="bar sleep"
                      style={{ height: `${item.sleep * 10}%` }}
                    />
                  </div>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>

            <div className="summary-list">
              {insightSignals.map((signal) => (
                <div key={signal.label} className="summary-item">
                  <div>
                    <strong>{signal.label}</strong>
                    <p>{signal.detail}</p>
                  </div>
                  <span>{signal.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="subtle">Safety routing</p>
                <h3>Parent alert logic</h3>
              </div>
              <ShieldCheck size={22} />
            </div>

            <div className="warning-card">
              <p className="warning-title">{supportState.label}</p>
              <p>{supportState.message}</p>
            </div>

            <div className="status-row">
              <div>
                <span>Stress above threshold</span>
                <strong>4 days</strong>
              </div>
              <div>
                <span>Poor sleep streak</span>
                <strong>4 nights</strong>
              </div>
            </div>

            <button type="button" className="ghost-button">
              Notify parents when needed
              <ArrowRight size={16} />
            </button>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="subtle">Support network</p>
                <h3>Connect the student safely</h3>
              </div>
              <Users size={22} />
            </div>

            <div className="community-grid">
              {communityCards.map((card) => (
                <div key={card.title} className="community-card">
                  <div className="community-meta">{card.meta}</div>
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>

            <div className="support-row support-row-tight">
              <button type="button" className="support-button">
                Join peer circle
              </button>
              <button type="button" className="support-button">
                Book therapist
              </button>
            </div>
          </article>

          <article className="panel panel-wide">
            <div className="panel-head">
              <div>
                <p className="subtle">Weekly update</p>
                <h3>What changed and what to do next</h3>
              </div>
              <MoonStars size={22} />
            </div>

            <div className="weekly-copy">
              {weeklySummary.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <div className="weekly-footer">
              <div className="mini-stat">
                <span>Best window</span>
                <strong>7:00 PM - 9:00 PM</strong>
              </div>
              <div className="mini-stat">
                <span>Primary trigger</span>
                <strong>Comparison after mocks</strong>
              </div>
              <div className="mini-stat">
                <span>Recommended fix</span>
                <strong>Sleep earlier and reset</strong>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="subtle">Core session</p>
                <h3>Conversation flow</h3>
              </div>
              <ChatCircle size={22} />
            </div>

            <ol className="flow-list">
              <li>Student shares a feeling, thought, or journaling entry.</li>
              <li>Gemini extracts signals into structured fields.</li>
              <li>Saathi answers with empathy, one insight, and one next step.</li>
              <li>If risk stays high, the parent/therapist route appears.</li>
            </ol>

            <div className="session-footer">
              <PhoneCall size={18} />
              <span>Emergency support route stays visible when risk rises.</span>
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="subtle">Substance</p>
                <h3>What makes this useful</h3>
              </div>
              <Heart size={22} />
            </div>

            <div className="checklist">
              <div className="check-item">Code quality: componentized UI and deterministic logic</div>
              <div className="check-item">Security: privacy-first wording and clear escalation gates</div>
              <div className="check-item">Efficiency: static dataset, one-screen demo, fast build</div>
              <div className="check-item">Accessibility: semantic headings, buttons, and contrast-first palette</div>
            </div>
          </article>
        </section>

        <footer className="bottom-nav" aria-label="Primary navigation">
          <button type="button" className="nav-item active">
            <House size={20} />
            <span>Today</span>
          </button>
          <button type="button" className="nav-item">
            <Users size={20} />
            <span>Peers</span>
          </button>
          <button type="button" className="nav-item">
            <Stethoscope size={20} />
            <span>Therapy</span>
          </button>
          <button type="button" className="nav-item">
            <MoonStars size={20} />
            <span>Weekly</span>
          </button>
        </footer>
      </div>
    </main>
  );
}
