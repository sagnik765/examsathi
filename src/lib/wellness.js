const COMPARISON_KEYWORDS = [
  "compare",
  "comparing",
  "comparison",
  "compared",
  "peer",
  "rank",
  "ranks",
  "behind",
  "score",
  "marks",
];

const LATE_STUDY_KEYWORDS = [
  "late",
  "midnight",
  "1 am",
  "2 am",
  "2:00",
  "all night",
  "all-nighter",
  "night",
  "past 11",
];

const POOR_SLEEP_KEYWORDS = [
  "sleep",
  "tired",
  "exhausted",
  "insomnia",
  "awake",
  "restless",
  "nap",
];

const PRESSURE_KEYWORDS = [
  "pressure",
  "parents",
  "family",
  "expect",
  "result",
  "mock",
  "test",
  "selection",
];

const DISTRACTION_KEYWORDS = [
  "phone",
  "scroll",
  "reels",
  "distract",
  "distracted",
  "notifications",
];

const CRISIS_KEYWORDS = [
  "suicid",
  "kill myself",
  "end it",
  "self harm",
  "self-harm",
  "hurt myself",
  "can't go on",
  "cannot go on",
  "take my life",
];

const FREQUENCY_LABELS = {
  psst: {
    0: "never",
    1: "almost never",
    2: "sometimes",
    3: "fairly often",
    4: "very often",
  },
  short: {
    0: "not at all",
    1: "several days",
    2: "more than half the days",
    3: "nearly every day",
  },
};

const INTENT_KEYWORDS = {
  pushback: [
    "what good",
    "won't help",
    "will not help",
    "doesn't help",
    "does not help",
    "makes no sense",
    "still can't",
    "still cannot",
    "why should",
    "how will that",
    "not enough",
    "too small",
  ],
  clarification: [
    "what do you mean",
    "explain",
    "why",
    "how",
    "what now",
    "what next",
    "next step",
    "how do i",
  ],
  planning: [
    "what should i do",
    "what do i do",
    "help me plan",
    "where do i start",
    "give me a plan",
    "what can i do",
    "what now",
  ],
};

const TOPIC_KEYWORDS = {
  comparison: [
    "compare",
    "comparing",
    "comparison",
    "rank",
    "behind",
    "marks",
    "score",
    "mock",
    "topper",
  ],
  sleep: [
    "sleep",
    "bed",
    "rest",
    "tired",
    "exhausted",
    "late night",
    "midnight",
    "wake",
    "insomnia",
  ],
  focus: [
    "focus",
    "concentrate",
    "concentration",
    "attention",
    "study",
    "revise",
    "revision",
    "start",
    "stuck",
    "distract",
  ],
  pressure: [
    "pressure",
    "parents",
    "family",
    "result",
    "selection",
    "expect",
    "exam",
  ],
  anxiety: [
    "anxious",
    "worry",
    "worried",
    "panic",
    "nervous",
    "afraid",
    "scared",
    "tense",
  ],
  distraction: [
    "phone",
    "scroll",
    "reels",
    "youtube",
    "notification",
    "distract",
    "distracted",
  ],
};

const SUPPORT_LIBRARY = {
  comparison: {
    explain:
      "Comparison can make one result feel like the whole story, especially right after a mock test.",
    actions: [
      {
        id: "comparison-last-mock",
        text: "Compare only against your last mock and note one thing that improved.",
      },
      {
        id: "comparison-break-rank",
        text: "Mute ranking apps for 24 hours so the score loop does not keep reopening.",
      },
      {
        id: "comparison-error-note",
        text: "Write down one mistake from the paper and one fix for the next block.",
      },
    ],
    question: "Was the hardest part the score itself, the ranking, or what it seemed to say about you?",
  },
  sleep: {
    explain:
      "Sleep is not an instant fix, but it usually gives concentration a better baseline to work from.",
    actions: [
      {
        id: "sleep-shift-twenty",
        text: "If a full bedtime change feels too much, move sleep 20 minutes earlier tonight.",
      },
      {
        id: "sleep-protect-window",
        text: "Protect the last 30 minutes before bed from revision and screens.",
      },
      {
        id: "sleep-wind-down",
        text: "If you cannot sleep earlier yet, try a 10-minute wind-down before the next study block.",
      },
    ],
    question: "Would a smaller sleep change or a short focus reset feel more realistic tonight?",
  },
  focus: {
    explain:
      "When concentration drops, the next move should usually be smaller rather than more ambitious.",
    actions: [
      {
        id: "focus-25-minutes",
        text: "Try one 25-minute block with the phone out of reach and one tiny task only.",
      },
      {
        id: "focus-two-minute-reset",
        text: "Do a two-minute reset: water, breathe, write the next task, then start again.",
      },
      {
        id: "focus-clear-next",
        text: "Pick the next exact subtopic now so you do not have to decide while tired.",
      },
    ],
    question: "What is blocking concentration most right now: worry, exhaustion, or distraction?",
  },
  pressure: {
    explain:
      "Pressure from family, results, or selection can keep the stress loop running even after you stop studying.",
    actions: [
      {
        id: "pressure-message",
        text: "Send one short update to a parent or mentor so the pressure is not carried alone.",
      },
      {
        id: "pressure-note",
        text: "Write the worry in one sentence and set it aside until the next check-in.",
      },
      {
        id: "pressure-ask",
        text: "Choose one concrete ask for support instead of holding the whole thing in your head.",
      },
    ],
    question: "Is the pressure coming more from yourself, family, or the outcome you are expecting?",
  },
  anxiety: {
    explain:
      "Anxiety usually gets louder when the brain keeps scanning for what might go wrong.",
    actions: [
      {
        id: "anxiety-grounding",
        text: "Use a 5-4-3-2-1 grounding pass before the next message or revision block.",
      },
      {
        id: "anxiety-breath",
        text: "Take six slow breaths and relax your shoulders before deciding the next step.",
      },
      {
        id: "anxiety-lower-stakes",
        text: "Switch to one lower-stakes task for 10 minutes so your system can settle first.",
      },
    ],
    question: "Does the anxiety feel more like worry, panic, or restlessness?",
  },
  distraction: {
    explain:
      "Distraction is often easier to reduce with environment changes than with willpower alone.",
    actions: [
      {
        id: "distraction-phone-away",
        text: "Put the phone in another room for the next study block.",
      },
      {
        id: "distraction-notifications",
        text: "Turn off notifications for one block so the brain gets a quiet lane.",
      },
      {
        id: "distraction-single-tab",
        text: "Keep one tab or one notebook open and close the rest for now.",
      },
    ],
    question: "What is pulling your attention away most often right now?",
  },
};

const SCALE_KB = [
  {
    id: "pss10",
    name: "Perceived Stress Scale",
    window: "last month",
    tags: ["stress", "control", "overloaded", "pressure"],
    explanation:
      "The PSS looks at how unpredictable, uncontrollable, and overloaded life has felt over the last month.",
    responseLabels: FREQUENCY_LABELS.psst,
    severityLabels: [
      { max: 13, label: "low perceived stress" },
      { max: 26, label: "moderate perceived stress" },
      { max: Infinity, label: "high perceived stress" },
    ],
    reverse: new Set([4, 5, 7, 8]),
    items: [
      {
        id: 1,
        prompt: "upset because something happened unexpectedly",
        keywords: ["unexpected", "surprised", "out of the blue", "sudden"],
      },
      {
        id: 2,
        prompt: "unable to control important things",
        keywords: ["unable to control", "no control", "cannot control", "could not control"],
      },
      {
        id: 3,
        prompt: "felt nervous and stressed",
        keywords: ["nervous", "stressed", "overwhelmed", "tense"],
      },
      {
        id: 4,
        prompt: "felt confident about handling personal problems",
        keywords: ["confident", "handle", "cope", "manage", "personal problems"],
      },
      {
        id: 5,
        prompt: "felt things were going your way",
        keywords: ["going my way", "things are going well", "on track", "in control"],
      },
      {
        id: 6,
        prompt: "could not cope with all the things to do",
        keywords: ["could not cope", "too much to do", "overloaded", "cannot keep up"],
      },
      {
        id: 7,
        prompt: "able to control irritations in your life",
        keywords: ["control irritations", "stay calm", "not irritated", "manage irritations"],
      },
      {
        id: 8,
        prompt: "felt on top of things",
        keywords: ["on top of things", "organized", "in control", "together"],
      },
      {
        id: 9,
        prompt: "angered because of things outside your control",
        keywords: ["angered", "outside my control", "frustrated", "irritated"],
      },
      {
        id: 10,
        prompt: "difficulties were piling up so high you could not overcome them",
        keywords: ["piling up", "could not overcome", "too much", "snowball"],
      },
    ],
  },
  {
    id: "dass21",
    name: "DASS-21",
    window: "past week",
    tags: ["stress", "anxiety", "depression", "overload", "panic"],
    explanation:
      "The DASS-21 separates stress, anxiety, and depression using 21 items from the past week.",
    responseLabels: FREQUENCY_LABELS.short,
    severityLabels: {
      depression: [
        { max: 9, label: "normal" },
        { max: 13, label: "mild" },
        { max: 20, label: "moderate" },
        { max: 27, label: "severe" },
        { max: Infinity, label: "extremely severe" },
      ],
      anxiety: [
        { max: 7, label: "normal" },
        { max: 9, label: "mild" },
        { max: 14, label: "moderate" },
        { max: 19, label: "severe" },
        { max: Infinity, label: "extremely severe" },
      ],
      stress: [
        { max: 14, label: "normal" },
        { max: 18, label: "mild" },
        { max: 25, label: "moderate" },
        { max: 33, label: "severe" },
        { max: Infinity, label: "extremely severe" },
      ],
    },
    items: [
      { id: 1, subscale: "stress", prompt: "hard to wind down", keywords: ["wind down", "relax", "unwind"] },
      { id: 2, subscale: "anxiety", prompt: "dryness of mouth", keywords: ["dry mouth"] },
      {
        id: 3,
        subscale: "depression",
        prompt: "couldn't experience any positive feeling",
        keywords: ["no positive feeling", "nothing felt good", "couldn't feel positive", "can’t feel positive"],
      },
      {
        id: 4,
        subscale: "anxiety",
        prompt: "breathing difficulty",
        keywords: ["breathing", "breathless", "breathlessness"],
      },
      {
        id: 5,
        subscale: "depression",
        prompt: "difficult to work up the initiative",
        keywords: ["no initiative", "couldn't start", "hard to start", "can’t start"],
      },
      {
        id: 6,
        subscale: "stress",
        prompt: "tended to over-react to situations",
        keywords: ["over-react", "overreact", "react too much", "too sensitive"],
      },
      {
        id: 7,
        subscale: "anxiety",
        prompt: "trembling",
        keywords: ["trembling", "shaking", "hands shaking"],
      },
      {
        id: 8,
        subscale: "stress",
        prompt: "using a lot of nervous energy",
        keywords: ["nervous energy", "on edge", "wired"],
      },
      {
        id: 9,
        subscale: "anxiety",
        prompt: "worried about panic and making a fool of myself",
        keywords: ["panic", "make a fool", "embarrass myself", "worried about panic"],
      },
      {
        id: 10,
        subscale: "depression",
        prompt: "nothing to look forward to",
        keywords: ["nothing to look forward", "hopeless", "future feels empty"],
      },
      {
        id: 11,
        subscale: "stress",
        prompt: "getting agitated",
        keywords: ["agitated", "irritable", "worked up"],
      },
      {
        id: 12,
        subscale: "stress",
        prompt: "difficult to relax",
        keywords: ["hard to relax", "cannot relax", "couldn't relax"],
      },
      {
        id: 13,
        subscale: "depression",
        prompt: "down-hearted and blue",
        keywords: ["down-hearted", "blue", "low mood", "down"],
      },
      {
        id: 14,
        subscale: "stress",
        prompt: "intolerant of interruptions",
        keywords: ["intolerant", "kept from", "interrupted", "frustrated by interruptions"],
      },
      {
        id: 15,
        subscale: "anxiety",
        prompt: "close to panic",
        keywords: ["close to panic", "panic"],
      },
      {
        id: 16,
        subscale: "depression",
        prompt: "unable to become enthusiastic",
        keywords: ["no enthusiasm", "not excited", "nothing excites me"],
      },
      {
        id: 17,
        subscale: "depression",
        prompt: "wasn't worth much as a person",
        keywords: ["worthless", "not worth much", "feel worthless"],
      },
      {
        id: 18,
        subscale: "stress",
        prompt: "rather touchy",
        keywords: ["touchy", "snappy", "short tempered"],
      },
      {
        id: 19,
        subscale: "anxiety",
        prompt: "aware of heart action in absence of exertion",
        keywords: ["heart racing", "heart pounding", "palpitation"],
      },
      {
        id: 20,
        subscale: "anxiety",
        prompt: "felt scared without good reason",
        keywords: ["scared", "afraid", "anxious", "fear"],
      },
      {
        id: 21,
        subscale: "depression",
        prompt: "life was meaningless",
        keywords: ["meaningless", "pointless", "no meaning"],
      },
    ],
  },
  {
    id: "gad7",
    name: "GAD-7",
    window: "past two weeks",
    tags: ["anxiety", "worry", "restless", "irritable", "panic"],
    explanation:
      "The GAD-7 screens for generalized anxiety by looking at how often worry and tension showed up over the past two weeks.",
    responseLabels: FREQUENCY_LABELS.short,
    severityLabels: [
      { max: 4, label: "minimal anxiety" },
      { max: 9, label: "mild anxiety" },
      { max: 14, label: "moderate anxiety" },
      { max: Infinity, label: "severe anxiety" },
    ],
    items: [
      { id: 1, prompt: "feeling nervous, anxious, or on edge", keywords: ["nervous", "anxious", "on edge"] },
      { id: 2, prompt: "not being able to stop or control worrying", keywords: ["stop worrying", "control worrying", "cannot stop worrying"] },
      { id: 3, prompt: "worrying too much about different things", keywords: ["worry too much", "different things", "many worries"] },
      { id: 4, prompt: "trouble relaxing", keywords: ["trouble relaxing", "can't relax", "cannot relax"] },
      { id: 5, prompt: "being so restless that it is hard to sit still", keywords: ["restless", "hard to sit still", "fidgety"] },
      { id: 6, prompt: "becoming easily annoyed or irritable", keywords: ["irritable", "annoyed", "snappy"] },
      { id: 7, prompt: "feeling afraid as if something awful might happen", keywords: ["awful might happen", "afraid", "dread", "something bad"] },
    ],
  },
];

export function getScaleSignalCoverage(entries) {
  const notes = entries
    .map((entry) => `${entry.note || ""} ${entry.mood || ""}`.toLowerCase())
    .join(" ");

  return SCALE_KB.map((scale) => {
    const matches = scale.items.filter((item) =>
      item.keywords.some((keyword) => notes.includes(keyword.toLowerCase())),
    );

    return {
      id: scale.id,
      name: scale.name,
      window: scale.window,
      matchedItems: matches.length,
      totalItems: scale.items.length,
      coverage: Math.round((matches.length / scale.items.length) * 100),
      evidence: matches.slice(0, 2).map((item) => item.prompt),
    };
  });
}

export const INITIAL_PROFILE = {
  name: "Aarav",
  exam: "JEE Main",
  city: "Pune",
};

export const PEER_CIRCLES = [
  {
    exam: "JEE Main",
    title: "JEE Main micro circle",
    summary: "A small peer space for students doing evening review and mock-test recovery.",
    members: "12 active students",
  },
  {
    exam: "NEET",
    title: "NEET steady pace circle",
    summary: "Focus, revision, and burnout checks for daily consistency.",
    members: "9 active students",
  },
  {
    exam: "CAT",
    title: "CAT sprint circle",
    summary: "For students balancing long study blocks, sectional practice, and confidence dips.",
    members: "7 active students",
  },
];

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function subtractDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - days);
  return copy;
}

function timeWindowLabel(time) {
  if (!time) {
    return "Unknown";
  }

  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw || "0");
  const total = hours + minutes / 60;

  if (total < 12) {
    return "Morning";
  }

  if (total < 17) {
    return "Afternoon";
  }

  if (total < 21) {
    return "Evening";
  }

  return "Late night";
}

function countMatches(text, keywords) {
  return keywords.reduce((total, keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(escaped, "g"));
    return total + (matches ? matches.length : 0);
  }, 0);
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function uniqueSorted(strings) {
  return [...new Set(strings)].sort((a, b) => a.localeCompare(b));
}

export function createSeedEntries(referenceDate = new Date()) {
  const template = [
    {
      stress: 3,
      sleepHours: 6.5,
      studyTime: "19:30",
      mood: "Steady",
      note:
        "Kept thinking about my friend's mock score and felt behind for a while, but I stopped checking rankings after dinner.",
    },
    {
      stress: 4,
      sleepHours: 5.9,
      studyTime: "22:40",
      mood: "Worried",
      note:
        "Compared marks after the test and studied late into the night. Phone use kept pulling me away.",
    },
    {
      stress: 4,
      sleepHours: 5.5,
      studyTime: "23:10",
      mood: "Tense",
      note:
        "Family asked about results and I started overthinking. I revised past midnight and slept badly.",
    },
    {
      stress: 5,
      sleepHours: 5.2,
      studyTime: "00:20",
      mood: "Overloaded",
      note:
        "Another comparison spiral after seeing top scores. I kept studying late and couldn't wind down.",
    },
    {
      stress: 4,
      sleepHours: 5.8,
      studyTime: "22:15",
      mood: "Drained",
      note:
        "Mock performance felt okay, but I worried about not being selected. Late study left me tired.",
    },
    {
      stress: 3,
      sleepHours: 6.2,
      studyTime: "20:30",
      mood: "Recovering",
      note:
        "I avoided ranking apps and took a short walk. Felt calmer after a shorter revision block.",
    },
    {
      stress: 4,
      sleepHours: 5.4,
      studyTime: "23:25",
      mood: "Uneasy",
      note:
        "Went back to comparison mode after mock results and studied much later than planned.",
    },
  ];

  return template.map((entry, index) => {
    const date = subtractDays(startOfDay(referenceDate), template.length - index - 1);
    return {
      id: `seed-${index + 1}`,
      date: formatDateKey(date),
      checkInTime: entry.studyTime,
      ...entry,
    };
  });
}

export function createSeedMessages(referenceDate = new Date()) {
  return [
    {
      id: "greeting",
      role: "assistant",
      createdAt: formatDateKey(referenceDate),
      text: "I’m here with you. Share how today felt, and I’ll keep the reply grounded in your own logs.",
    },
  ];
}

export function createSeedRequests() {
  return [];
}

export function createJournalEntry(input, referenceDate = new Date()) {
  return {
    id:
      (typeof globalThis !== "undefined" &&
        globalThis.crypto &&
        typeof globalThis.crypto.randomUUID === "function" &&
        globalThis.crypto.randomUUID()) ||
      `entry-${Date.now()}`,
    date: input.date || formatDateKey(referenceDate),
    checkInTime: input.checkInTime || "21:00",
    stress: Number(input.stress),
    sleepHours: Number(input.sleepHours),
    mood: input.mood,
    note: input.note.trim(),
    studyTime: input.studyTime,
  };
}

export function analyzeWellness(entries) {
  const ordered = [...entries].sort(
    (left, right) => new Date(left.date) - new Date(right.date),
  );
  const recent = ordered.slice(-7);
  const total = recent.length || 1;
  const stressValues = recent.map((entry) => Number(entry.stress) || 0);
  const sleepValues = recent.map((entry) => Number(entry.sleepHours) || 0);
  const avgStress =
    stressValues.reduce((sum, value) => sum + value, 0) / total;
  const avgSleep =
    sleepValues.reduce((sum, value) => sum + value, 0) / total;

  const triggerCounts = {
    comparison: 0,
    lateStudy: 0,
    poorSleep: 0,
    pressure: 0,
    distraction: 0,
  };

  const triggerExamples = {
    comparison: [],
    lateStudy: [],
    poorSleep: [],
    pressure: [],
    distraction: [],
  };

  const timeWindows = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
    "Late night": 0,
  };

  let issueStreak = 0;
  let longestIssueStreak = 0;
  let lateStudyDays = 0;
  let poorSleepDays = 0;
  let highStressDays = 0;

  recent.forEach((entry) => {
    const note = `${entry.note || ""} ${entry.mood || ""}`.toLowerCase();
    const sleepHours = Number(entry.sleepHours) || 0;
    const stress = Number(entry.stress) || 0;
    const timeWindow = timeWindowLabel(entry.studyTime);
    timeWindows[timeWindow] = (timeWindows[timeWindow] || 0) + 1;

    if (sleepHours < 6) {
      poorSleepDays += 1;
    }

    if (stress >= 4) {
      highStressDays += 1;
    }

    const isIssue = sleepHours < 6 || stress >= 4;

    if (isIssue) {
      issueStreak += 1;
      longestIssueStreak = Math.max(longestIssueStreak, issueStreak);
    } else {
      issueStreak = 0;
    }

    const lateStudyText = `${entry.studyTime || ""} ${note}`;
    if (
      timeWindow === "Late night" ||
      containsAny(lateStudyText, LATE_STUDY_KEYWORDS)
    ) {
      lateStudyDays += 1;
    }

    if (containsAny(note, COMPARISON_KEYWORDS)) {
      triggerCounts.comparison += countMatches(note, COMPARISON_KEYWORDS);
      if (triggerExamples.comparison.length < 3) {
        triggerExamples.comparison.push(entry.note);
      }
    }

    if (containsAny(note, LATE_STUDY_KEYWORDS) || timeWindow === "Late night") {
      triggerCounts.lateStudy += 1;
      if (triggerExamples.lateStudy.length < 3) {
        triggerExamples.lateStudy.push(entry.note);
      }
    }

    if (containsAny(note, POOR_SLEEP_KEYWORDS) || sleepHours < 6) {
      triggerCounts.poorSleep += 1;
      if (triggerExamples.poorSleep.length < 3) {
        triggerExamples.poorSleep.push(entry.note);
      }
    }

    if (containsAny(note, PRESSURE_KEYWORDS)) {
      triggerCounts.pressure += 1;
      if (triggerExamples.pressure.length < 3) {
        triggerExamples.pressure.push(entry.note);
      }
    }

    if (containsAny(note, DISTRACTION_KEYWORDS)) {
      triggerCounts.distraction += 1;
      if (triggerExamples.distraction.length < 3) {
        triggerExamples.distraction.push(entry.note);
      }
    }
  });

  const triggerOrder = Object.entries(triggerCounts)
    .sort((left, right) => right[1] - left[1])
    .filter(([, value]) => value > 0);

  const topTrigger = triggerOrder[0] || ["none", 0];
  const topTriggerLabel = {
    comparison: "Comparison",
    lateStudy: "Late study",
    poorSleep: "Poor sleep",
    pressure: "Pressure",
    distraction: "Distraction",
  }[topTrigger[0]];

  const peakWindow = Object.entries(timeWindows).sort(
    (left, right) => right[1] - left[1],
  )[0];

  const strongestEvidence = uniqueSorted([
    ...(triggerExamples.comparison.length ? ["comparison"] : []),
    ...(triggerExamples.lateStudy.length ? ["late study"] : []),
    ...(triggerExamples.poorSleep.length ? ["sleep debt"] : []),
    ...(triggerExamples.pressure.length ? ["pressure"] : []),
    ...(triggerExamples.distraction.length ? ["distraction"] : []),
  ]);

  const recommendation = deriveRecommendation({
    avgStress,
    avgSleep,
    topTrigger: topTrigger[0],
    issueDays: poorSleepDays + highStressDays,
    lateStudyDays,
  });

  const weeklySummary = buildWeeklySummary({
    avgStress,
    avgSleep,
    peakWindow,
    topTrigger: topTrigger[0],
    topTriggerLabel,
    triggerCounts,
    recommendation,
  });

  return {
    recent,
    avgStress,
    avgSleep,
    poorSleepDays,
    highStressDays,
    lateStudyDays,
    issueStreak: longestIssueStreak || issueStreak,
    triggerCounts,
    triggerExamples,
    topTrigger: topTrigger[0],
    topTriggerLabel,
    peakWindow,
    strongestEvidence,
    recommendation,
    weeklySummary,
  };
}

function deriveRecommendation({ avgStress, avgSleep, topTrigger, issueDays, lateStudyDays }) {
  const actions = [];

  if (avgSleep < 6) {
    actions.push("sleep before 12:30 AM and protect the last 30 minutes before bed");
  }

  if (topTrigger === "comparison") {
    actions.push("mute ranking apps after mocks and compare your score only with last week");
  }

  if (topTrigger === "lateStudy" || lateStudyDays >= 3) {
    actions.push("set a hard stop for study sessions and switch to a short wind-down");
  }

  if (avgStress >= 4) {
    actions.push("use a two-minute reset before the next revision block");
  }

  if (issueDays >= 3) {
    actions.push("loop in a parent so the load does not stay hidden");
  }

  if (!actions.length) {
    actions.push("keep the current rhythm and log again tomorrow");
  }

  return actions[0];
}

function buildWeeklySummary({
  avgStress,
  avgSleep,
  peakWindow,
  topTrigger,
  topTriggerLabel,
  triggerCounts,
  recommendation,
}) {
  const summary = [];

  if (peakWindow?.[1] > 0) {
    summary.push(
      `Stress is peaking most often in the ${peakWindow[0].toLowerCase()} slot, based on this week’s logs.`,
    );
  } else {
    summary.push("I do not have enough time-stamp data yet to name a stress window.");
  }

  if (topTrigger !== "none") {
    summary.push(
      `${topTriggerLabel} is the strongest repeating trigger, appearing ${triggerCounts[topTrigger]} time(s).`,
    );
  } else {
    summary.push("No repeating trigger stands out yet, so the current data is still small.");
  }

  summary.push(
    `Average stress is ${avgStress.toFixed(1)}/5 and average sleep is ${avgSleep.toFixed(
      1,
    )} hours.`,
  );
  summary.push(`Best next step: ${recommendation}.`);

  return summary;
}

export function getSupportState(analysis) {
  const issueStreak = analysis.issueStreak || 0;

  if (issueStreak >= 7) {
    return {
      tone: "critical",
      label: "Critical warning",
      message:
        `Stress or sleep has stayed poor for ${issueStreak} days. Loop in a trusted adult now and keep support visible.`,
    };
  }

  if (issueStreak >= 3) {
    return {
      tone: "warning",
      label: "Warning",
      message:
        `Stress or sleep has stayed poor for ${issueStreak} days. A parent check-in is recommended so this does not get missed.`,
    };
  }

  return {
    tone: "normal",
    label: "Stable",
    message: "Signals are within a manageable range today.",
  };
}

function classifyIntent(text) {
  const normalized = text.toLowerCase();

  if (INTENT_KEYWORDS.pushback.some((phrase) => normalized.includes(phrase))) {
    return "pushback";
  }

  if (INTENT_KEYWORDS.planning.some((phrase) => normalized.includes(phrase))) {
    return "planning";
  }

  if (INTENT_KEYWORDS.clarification.some((phrase) => normalized.includes(phrase))) {
    return "clarification";
  }

  return "support";
}

function extractTopics(text) {
  const normalized = text.toLowerCase();

  return Object.entries(TOPIC_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([topic]) => topic);
}

function summarizeConversation(conversation) {
  const assistantMessages = [...conversation]
    .filter((message) => message.role === "assistant")
    .slice(-4);

  const lastAssistant = assistantMessages.at(-1) || null;
  const lastTopic = lastAssistant?.topic || extractTopics(lastAssistant?.text || "")[0] || null;
  const lastStepId = lastAssistant?.stepId || null;

  return {
    lastAssistant,
    lastTopic,
    lastStepId,
    usedStepIds: assistantMessages.map((message) => message.stepId).filter(Boolean),
  };
}

function chooseTopic({ input, analysis, conversation, intent }) {
  const topics = extractTopics(input);
  const convo = summarizeConversation(conversation);
  const normalized = input.toLowerCase();

  let topic = topics[0] || convo.lastTopic || "focus";

  if (normalized.includes("concentrat") || normalized.includes("focus")) {
    topic = "focus";
  } else if (normalized.includes("sleep") || normalized.includes("tired")) {
    topic = "sleep";
  }

  if (analysis.topTrigger === "pressure" && topic === "focus" && intent !== "pushback") {
    topic = "pressure";
  }

  if (intent === "pushback" && convo.lastTopic === topic) {
    const fallback = {
      sleep: "focus",
      comparison: "focus",
      pressure: "focus",
      anxiety: "focus",
      distraction: "focus",
      focus: "comparison",
    }[topic];

    topic = fallback || topic;
  }

  if (!SUPPORT_LIBRARY[topic]) {
    topic = "focus";
  }

  return topic;
}

function buildEvidence(topic, input, analysis) {
  const normalized = input.toLowerCase();
  const snippets = [];
  const mentionsSleep = normalized.includes("sleep") || normalized.includes("tired") || normalized.includes("rest");
  const mentionsLateStudy =
    normalized.includes("late") || normalized.includes("midnight") || normalized.includes("night");
  const mentionsComparison =
    normalized.includes("compar") || normalized.includes("rank") || normalized.includes("marks");
  const mentionsPressure =
    normalized.includes("pressure") || normalized.includes("parents") || normalized.includes("family");
  const mentionsDistraction =
    normalized.includes("phone") || normalized.includes("scroll") || normalized.includes("distract");
  const mentionsFocus = normalized.includes("concentrat") || normalized.includes("focus");

  switch (topic) {
    case "comparison":
      if (analysis.triggerCounts.comparison > 0) {
        snippets.push(
          `Comparison shows up ${analysis.triggerCounts.comparison} time(s) in the current logs.`,
        );
      }
      break;
    case "sleep":
      snippets.push(`Average sleep is ${analysis.avgSleep.toFixed(1)} hours across the last week.`);
      if (normalized.includes("concentrat") || normalized.includes("focus")) {
        snippets.push("You are naming concentration as the real blocker, so sleep is only one part of the picture.");
      }
      break;
    case "pressure":
      if (analysis.triggerCounts.pressure > 0) {
        snippets.push(`Pressure appears ${analysis.triggerCounts.pressure} time(s) in the recent notes.`);
      }
      break;
    case "distraction":
      if (analysis.triggerCounts.distraction > 0) {
        snippets.push(
          `Distraction appears ${analysis.triggerCounts.distraction} time(s) in the recent notes.`,
        );
      }
      break;
    default:
      if (mentionsFocus) {
        snippets.push("You are naming concentration as the immediate blocker, so the next step should reduce cognitive load.");
      }
      if (analysis.topTrigger !== "none") {
        snippets.push(`The clearest repeating signal in the logs is ${analysis.topTriggerLabel.toLowerCase()}.`);
      }
      break;
  }

  if (mentionsSleep && !snippets.some((snippet) => snippet.toLowerCase().includes("sleep"))) {
    snippets.push(`Average sleep is ${analysis.avgSleep.toFixed(1)} hours across the last week.`);
  }

  if (mentionsComparison && analysis.triggerCounts.comparison > 0) {
    snippets.push(`Comparison shows up ${analysis.triggerCounts.comparison} time(s) in the current logs.`);
  }

  if (mentionsLateStudy && analysis.triggerCounts.lateStudy > 0) {
    snippets.push(`Late-night study shows up ${analysis.triggerCounts.lateStudy} time(s) this week.`);
  }

  if (mentionsPressure && analysis.triggerCounts.pressure > 0) {
    snippets.push(`Pressure appears ${analysis.triggerCounts.pressure} time(s) in the recent notes.`);
  }

  if (mentionsDistraction && analysis.triggerCounts.distraction > 0) {
    snippets.push(`Distraction appears ${analysis.triggerCounts.distraction} time(s) in the recent notes.`);
  }

  if (!snippets.length) {
    snippets.push("I am keeping this tied to the pattern in the logs rather than guessing.");
  }

  return snippets;
}

function crisisReply() {
  return {
    role: "assistant",
    text:
      "I’m really sorry you’re carrying this. I can’t help with self-harm. Please contact a trusted adult or emergency services right now. If you are in the US or Canada, call or text 988. If you are elsewhere, contact your local crisis line or emergency number.",
  };
}

export function buildSaathiReply(input, analysis, conversation = []) {
  const normalized = input.toLowerCase();
  const intent = classifyIntent(normalized);

  if (CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return crisisReply();
  }

  if (!analysis.recent.length) {
    return {
      role: "assistant",
      text:
        "I do not have enough logs yet to read a pattern safely. Share one check-in or journal entry and I’ll stay grounded in that data.",
    };
  }

  const topic = chooseTopic({ input: normalized, analysis, conversation, intent });
  const convo = summarizeConversation(conversation);
  const library = SUPPORT_LIBRARY[topic] || SUPPORT_LIBRARY.focus;
  const action = library.actions.find((candidate) => !convo.usedStepIds.includes(candidate.id)) || library.actions[0];
  const evidence = buildEvidence(topic, normalized, analysis);

  const leadByIntent = {
    pushback: "You’re right to question advice that does not address the problem you actually named.",
    planning: "Let’s narrow this to one useful next step.",
    clarification: "Here is the grounded read from the current logs.",
    support: "I hear you.",
  }[intent];

  const answerMode =
    intent === "pushback" && convo.lastTopic === topic ? "repair" : intent === "planning" ? "plan" : "support";

  return {
    role: "assistant",
    topic,
    mode: answerMode,
    stepId: action.id,
    text: `${leadByIntent} ${evidence.join(" ")} ${library.explain} Try this now: ${action.text} ${library.question}`,
  };
}

export function summarizeEntry(entry) {
  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formattedDate} · Stress ${entry.stress}/5 · Sleep ${entry.sleepHours.toFixed(1)}h · ${entry.mood}`;
}

export function formatDateRange(entries) {
  if (!entries.length) {
    return "No entries yet";
  }

  const sorted = [...entries].sort(
    (left, right) => new Date(left.date) - new Date(right.date),
  );
  const first = new Date(sorted[0].date);
  const last = new Date(sorted[sorted.length - 1].date);

  return `${first.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${last.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export function getTimeWindowSeries(entries) {
  return entries.map((entry) => ({
    id: entry.id,
    day: new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" }),
    stress: Number(entry.stress) || 0,
    sleep: Number(entry.sleepHours) || 0,
    timeWindow: timeWindowLabel(entry.studyTime),
  }));
}

export function initialCountsForRequests() {
  return {
    peer: 0,
    therapist: 0,
    parent: 0,
  };
}
