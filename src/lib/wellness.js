const COMPARISON_KEYWORDS = [
  "compare",
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

function crisisReply() {
  return {
    role: "assistant",
    text:
      "I’m really sorry you’re carrying this. I can’t help with self-harm. Please contact a trusted adult or emergency services right now. If you are in the US or Canada, call or text 988. If you are elsewhere, contact your local crisis line or emergency number.",
  };
}

export function buildSaathiReply(input, analysis) {
  const normalized = input.toLowerCase();

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

  const evidence = [];

  if (
    containsAny(normalized, COMPARISON_KEYWORDS) ||
    normalized.includes("behind") ||
    normalized.includes("rank")
  ) {
    if (analysis.triggerCounts.comparison > 0) {
      evidence.push(
        `Comparison appears ${analysis.triggerCounts.comparison} time(s) in the current logs.`,
      );
    } else {
      evidence.push("I do not see comparison in the logs yet.");
    }
  }

  if (containsAny(normalized, POOR_SLEEP_KEYWORDS) || normalized.includes("sleep")) {
    evidence.push(
      `Average sleep is ${analysis.avgSleep.toFixed(1)} hours, so recovery is currently a bit short.`,
    );
  }

  if (containsAny(normalized, LATE_STUDY_KEYWORDS) || normalized.includes("late")) {
    evidence.push(
      `Late-night study shows up ${analysis.triggerCounts.lateStudy} time(s) in this week.`,
    );
  }

  if (containsAny(normalized, PRESSURE_KEYWORDS) || normalized.includes("stress")) {
    evidence.push(
      `The strongest repeating trigger right now is ${analysis.topTriggerLabel?.toLowerCase() || "a repeating stress pattern"}.`,
    );
  }

  if (!evidence.length) {
    if (analysis.topTrigger !== "none") {
      evidence.push(
        `The clearest pattern I can ground in your logs is ${analysis.topTriggerLabel.toLowerCase()}.`,
      );
    } else {
      evidence.push("I need a little more data before I can call out a pattern.");
    }
  }

  return {
    role: "assistant",
    text: `I hear you. ${evidence.join(" ")} Want to try ${analysis.recommendation}?`,
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
