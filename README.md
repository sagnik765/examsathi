# ExamSathi

Public repo: https://github.com/sagnik765/examsathi
Live demo: https://sagnik765.github.io/examsathi/

ExamSathi is a hackathon-ready mental wellness tracker for students preparing for high-stakes exams like JEE, NEET, CAT, CUET, GATE, and UPSC.

## What changed

- Intimate, conversation-led support through the Saathi assistant.
- Data-backed pattern explanations for comparison, late study, and poor sleep.
- Parent warning logic that escalates after 3 days and turns critical after 7 days.
- Peer connection for same-exam students and a path to a professional therapist.
- Weekly stress summary with likely trigger windows and mitigation advice.

## Tech stack

- Vite
- React 19
- CSS
- Phosphor icons
- Vitest for the warning-threshold test

## GenAI usage in the submission

- Gemini: journaling analysis and signal extraction into structured stress, sleep, and trigger data.
- Gemini structured output: consistent JSON for the weekly summary, warning state, and conversation insights.
- Conversational AI layer: the Saathi assistant turns patterns into empathetic, context-aware responses.

## Local run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
