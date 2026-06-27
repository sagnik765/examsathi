# ExamSathi

Public repo: https://github.com/sagnik765/examsathi
Live demo: https://sagnik765.github.io/examsathi/

ExamSathi is a hackathon-ready mental wellness tracker for students preparing for high-stakes exams like JEE, NEET, CAT, CUET, GATE, and UPSC.

## What changed

- The static mock is now a stateful single-page app with live journal input, chat replies, support requests, and persistent local data.
- Saathi responds to the student’s own logs instead of hardcoded copy, so the app stays grounded and avoids made-up patterns.
- Parent warning logic escalates after 3 poor-signal days and turns critical after 7.
- Peer connection for same-exam students and a path to a professional therapist.
- Weekly stress summary with trigger windows, likely causes, and mitigation advice.
- The UI now uses a calmer mental-health-friendly palette and softer typography.

## Tech stack

- Vite
- React 19
- CSS
- Phosphor icons
- Vitest and Testing Library for interaction coverage
- localStorage for lightweight persistence

## GenAI usage in the submission

- The submission narrative is designed around Gemini structured output for journal analysis, stress-trigger extraction, and Saathi response planning.
- The live demo intentionally uses a deterministic evidence-first analysis engine so it stays hallucination-free and only talks about patterns that are actually present in the student’s logs.
- If you later wire a Gemini backend, the app already has the structured fields needed for it.

## Local run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
