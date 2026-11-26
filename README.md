# DeuxLangues

A quiet place to practice French. The site opens on one Today screen and walks through the day’s practice in order, so there is nothing to decide.

Learning content is in French. The interface is in English.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Today

Three steps, in order. A day counts once at least one step is finished. The streak and the progress bar update as you go. A missed day resets quietly.

1. **Topic and writing.** One French topic (sample: remote work, C1). Write up to five lines, then see each sentence beside a correction and a short reason, plus a full corrected version. The sample text has real notes. Anything else shows the layout only.
2. **Mimic.** A short French passage, key expressions, a Listen button (French voice through the browser), and a recorder so you can play your take next to the original.
3. **Conversation.** A spoken-chat shape with two role-play scenes (restaurant, clothes shop). Lines are samples. The partner replies in text and voice, and corrections appear only after you finish.

## Also on the menu

- **Notebook.** Phrases from the sample practice, with the correction, an example, the date, and a practiced count. Mark items learned, or review the ones still open.
- **Progress.** One metric: filler words per minute (`euh`, `ben`, `bah`, `tu vois`, `enfin`), drawn as a line from the first sample recording to the latest.

## How it’s built

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. Everything currently lives in the browser. Sample topics, corrections, scenes, notebook entries, and progress points are in `lib/data.tsx`. Nothing is saved yet, and there is no model behind the corrections or the conversation.
