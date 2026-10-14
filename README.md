# Place a Task — Human-AI Group 8

One interactive slide for our MGMT 6110 Week 7 presentation on the Map of Human-AI Collaboration. The class calls a quadrant, we click a task card, and the card glides into the quadrant we chose while our reason appears underneath.

The brief this was built from is in `human-ai-group-8-rgogc-prompt.md`.

## Run it locally

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

## Edit the tasks and reasons

Everything the slide says about the tasks is in `src/tasks.ts`. Each task has a `label` (the card text), a `quadrant`, and a `reason`. The quadrant ids are:

| id | Quadrant |
|---|---|
| `person-leads` | A person leads, AI inside |
| `agents-run` | Agents run it, a person judges |
| `ai-alone` | AI alone, with checks |
| `person-decides` | A person decides, AI alongside |

The order of `TASKS` is the order of the cards in the tray and the order a clicker places them. Run `npm test` after editing. It fails if a task points at a quadrant that does not exist or two tasks share an id.

## Presenting

- **Clicking a card** places it. Clicking a placed card sends it back to the tray.
- **A presentation clicker works.** Right arrow, Down arrow, Page Down or Space places the next card in tray order. Left arrow, Up arrow or Page Up sends the most recent card back.
- **Show all** places the remaining cards one after another. **Clear** resets the slide. Reloading the page also resets it.
- **Go full screen** with Ctrl+Cmd+F in Safari or Chrome on a Mac, or F11 on Windows. The slide scales to fit any 16:9 screen without scrolling.
- **It works offline** once it has loaded, so a flaky classroom Wi-Fi does not matter. For extra safety, run `npm run build && npm run preview` on the presenting laptop.

## Deploy

Live at https://human-ai-group-8.vercel.app. The Vercel project is connected to this GitHub repo, so every push to `main` deploys to production on its own. Pushes to other branches get a preview link.

To deploy straight from the laptop without pushing:

```bash
npx -y vercel@latest deploy --prod --yes --scope mbai3
```

## Project layout

```
src/tasks.ts       the six tasks, quadrants, axis labels and reasons
src/placement.ts   pure placement logic (place, return, next, status line, data checks)
src/App.tsx        the slide, card flight animation and clicker keys
src/index.css      layout and colours, all sized from one 16:9 unit
tests/             node:test specs for placement.ts and the slide data
```

## Next

- Add each group member's name to the footer.
- Add a "guess first" mode that hides the reason until a second click.
