You are helping me build a personal French-practice website. It is for me
only at first. If it really works for me, I may offer it to other learners
later. Keep it simple and human-feeling, not corporate.

HOW TO WORK WITH ME

- Before planning anything, ask me up to 3 short questions and wait for my answers.
- Then build in small steps. For each step, first show me a working visual
  prototype (clickable, fake data is fine). Wait for my approval before
  wiring real logic or moving on.
- I will direct changes in small steps. Do not add features I did not ask for.

STACK
Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
Start with no backend: store data in the browser (localStorage or IndexedDB).
The conversation step needs a server route to call an AI model, so do not
use static export (`output: "export"`) for this project.
All learning content is in French. Interface language: English, with a
setting to switch the labels to French later.

THE CORE IDEA: ONE "TODAY" SCREEN
The app opens on a single Today screen. It walks me through my daily
practice in order, one step at a time, so I never have to decide where to go.
At the top: my streak and a progress bar showing which steps are done today.
Finishing a step takes me to the next one.

Daily steps, in order:

1. Topic and writing: show one French topic for the day (opinion, event, or
   complex topic) at my chosen level (B1, B2, C1, C2). I write up to 5
   lines. Show corrections sentence by sentence (original, corrected
   version, short reason), then a full corrected version.
2. Mimic: an AI-generated French text of about 150-170 words at my level, a
   Listen button (browser text-to-speech, French voice), key expressions
   with meanings, and a recorder so I can repeat it and play my recording
   next to the original.
3. Conversation: a spoken chat with an AI agent in French. I speak, it
   transcribes and replies in text and voice. It must NOT interrupt me or
   ask a question every turn. It corrects me gently AFTER I finish (verb
   tenses, agreement, wrong words) and gives a short corrected version of
   what I said. Support role-play scenes (e.g. restaurant waiter and customer).

SECONDARY VIEWS (small menu, not part of the daily flow)

- Notebook: fills itself automatically with every word or phrase I got wrong
  or asked about, with the correction, an example sentence, the date, and a
  "practiced" counter. I can mark items as learned and review them.
- Progress: start with ONE metric only: filler words per minute in my
  spoken recordings ("euh", "ben", "bah", "tu vois", "enfin"). Show a simple
  line over time and compare my first recording with my latest. No other
  metrics until I ask.

STREAKS

- A day counts if I complete at least one step.
- Show current streak, longest streak, and a small calendar of active days
  on the Today screen. No guilt messages: a missed day just resets quietly.

DESIGN
Calm, minimal, mobile-friendly. Big record and listen buttons. Warm,
encouraging copy, no formal wording.

FIRST STEP
Ask me your questions now. Then show a clickable prototype of the Today
screen only (streak, progress bar, and step 1 opened), and stop for my approval.
