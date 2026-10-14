# RGOGC Prompt — Human-AI Group 8 (Place a Task)

## R — Role
You are a senior presentation designer and React engineer who builds interactive slides that run live in a lecture room. You care about legibility from the back row, one obvious action per click, motion that explains rather than decorates, and a presenter who never has to fight the software. You default to removing elements rather than adding them.

## G — Goal
Build one interactive slide for Human-AI Group 8's class presentation in MGMT 6110 (Week 7, The Map of Human-AI Collaboration). The screen shows a 2×2 map of human-AI collaboration and a row of six task cards. The class calls a quadrant out loud, the presenter clicks the card and then the quadrant the class called, and the card glides into the quadrant the group chose. Underneath, the slide says whether the class agreed, then gives the group's one-line reason. By the end all six cards sit on the map and the room has argued about at least one of them.

## O — Output
A Vite + React + TypeScript project in `human-ai-group-8/` with plain CSS, a README, and `node:test` tests for the placement logic. One screen, top to bottom:

1. **Kicker** — small spaced capitals in teal: "PLACE A TASK · YOUR TURN".
2. **Title** — "Where would you place each of these tasks, and who should lead it?"
3. **Subtitle** — "Call the quadrant for each task before we click. The placements are our group's view, and you may well place some differently." This is the only place the slide tells the audience what to do. Once all six cards are placed, the same line fades into a crimson closing question in the heading font: "All six are placed. Which one would you move, and why?" It goes back to the instruction when any card returns to the tray.
4. **Explainer panel** — a pale card with a crimson bar down its left edge. Inside, top left, a crimson pill badge with a small yellow dot: "HUMAN-AI GROUP 8". In the middle, a small muted colour key: a pink swatch "A person leads" and a blue swatch "AI does the work", so the room sees that the colours split the map diagonally by who is in charge. Top right, a monospace status line: "Click a task" before anything is placed, then "3 of 6 placed", then "All 6 placed".
5. **The map** — inside the panel, a 2×2 grid with these labels, exactly as in the course slide:
   - Column headings: "Work with a right answer" (left), "Work with no single right answer" (right).
   - Row headings: "Work that people and AI must do together" (top), "Work that either of them can do alone" (bottom).
   - Quadrants: top left "A person leads, AI inside" (pink), top right "Agents run it, a person judges" (blue), bottom left "AI alone, with checks" (blue), bottom right "A person decides, AI alongside" (pink).
   Each quadrant shows its name in bold at the top left, and placed cards stack below it as chips.
6. **Reason panel** — a strip under the map with a coloured bar on the left: neutral grey at the start, crimson while a card waits for the class's call, then the colour of the quadrant the shown card sits in (pink `#a8467e` or blue `#1f6f8b`), so the eye links the reason to the card. Before anything is placed, a muted "Pick a task below to start." While a card waits for the call: "Where does the class put **Market surveying**? Click that quadrant, or click the card again to reveal without a call." After the reveal: the task name in bold, then the verdict, then the group's reason. The verdict reads "The class called X, and so did we." in teal when the room agreed, "The class called X. We placed it in Y." in crimson when it did not, or "lands in Y." when no call was recorded. The quadrant that just received a card glows briefly.
7. **Task tray** — the six cards as outlined chips in one wrapping row, followed by a filled navy "Show all" button and an outlined "Clear" button. A placed card leaves a dashed outline in its slot with its name in faint grey, so the tray never reflows and never reads as a row of blank boxes.
8. **Footer** — a thin rule, then "SMU · MGMT 6110 · Week 7 · The Map of Human-AI Collaboration" on the left and "Human-AI Group 8" on the right, each on one line. When the group lists its members in `src/tasks.ts`, their names follow "Human-AI Group 8", for example "Human-AI Group 8: Name, Name, Name".
9. **README** — run it locally, how to edit the tasks and reasons, presenting tips (clicker keys, the F key for full screen), deploy to Vercel, project layout, a short "Next" list.

**The six tasks, their quadrants and reasons** (reasons are drafts for the group to edit in `src/tasks.ts`):

| Card | Quadrant | Reason |
|---|---|---|
| Schedule-making assistant | Agents run it, a person judges | The agent can juggle calendars, travel time and clashes on its own, but only you know which meetings really matter, so you approve the week it proposes. |
| Cancelling a subscription | Agents run it, a person judges | The agent can find the account and work through the cancel flow, but it stops for your confirmation before anything is final, because money and access are at stake. |
| Market surveying | A person leads, AI inside | AI drafts the questions and tallies the answers fast, but a person decides what we need to learn and checks that the numbers hold up. |
| News briefing | AI alone, with checks | Summarising today's headlines is well-defined work AI can do on its own, with spot checks against the original sources. |
| Developing a business product and what to sell | A person leads, AI inside | AI can size demand, compare competitors and stress-test ideas, but a person owns the bet on what to sell and answers for it. |
| Outfit planner | A person decides, AI alongside | There is no single right outfit. AI can suggest combinations from your wardrobe and the weather, but taste is personal, so you choose. |

## G — Guardrails
- **Stack:** Vite, React 19, TypeScript, plain CSS. No UI kit, no animation library, no state library, no icon package, no backend, no analytics, no runtime network requests, no web-font downloads. It must run from the laptop with the Wi-Fi off.
- **Interaction:** clicking a tray card lifts it: a crimson border, a soft shadow, and every quadrant turns dashed and clickable. Clicking the quadrant the class called records that call and places the card in the group's quadrant. Clicking the lifted card again reveals it without a call, and Escape puts it down. The class's call is forgotten when a card goes back to the tray. Clicking a placed card shows its reason again, so the room can revisit any card mid-discussion. Pointing at a placed card reveals a small crimson × at its corner, and clicking the × sends the card back to its slot in the tray. If its reason was showing, the panel shows the card placed before it, or the starting text when none is left. Keyboard focus follows the card: after placing, it moves to the next tray card. "Show all" places the remaining cards one after another, 150 ms apart, and the reason panel then shows the last one. "Clear" sends every card home and restores the starting text. All cards are real `<button>`s.
- **Clicker support:** Right arrow, Down arrow, Page Down and Space reveal the lifted card, or else place the next unplaced card in tray order, without a call. Left arrow, Up arrow and Page Up put down the lifted card, or else return the most recently placed card. Presentation clickers send exactly these keys. F toggles browser full screen, and a muted "Press F for full screen" sits at the right end of the kicker line until full screen is on. Nothing else listens to the keyboard.
- **Motion:** the card flies from its tray slot to its quadrant over 450 ms with an ease-out curve (a FLIP transform animation, not a layout animation). The receiving quadrant's border glows for 900 ms. Returning cards fly back the same way. Under `prefers-reduced-motion`, cards move instantly and nothing glows.
- **State:** in memory only. A reload is a clean reset, which is what a presenter wants before class. No localStorage.
- **Typography:** headings and labels in `Futura, "Avenir Next", "Century Gothic", "Trebuchet MS", sans-serif` at 600–700 weight. Body in `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. Status line in `"SF Mono", Menlo, Consolas, monospace`. Title about 32px and body about 20px at 1280px wide, scaling with the viewport. Cards are the largest text after the title: about 19px in the tray and 20px on the map at 1280px, 29px and 31px at 1920px, so the back row can read every one.
- **Colour:** page `#ffffff`, panel `#f7f9fb`, navy text `#14284b`, muted `#5b6b82`, teal kicker and blue accent `#1f6f8b`, pink accent `#a8467e`, crimson bar and badge `#c62a43`, badge dot `#f6c945`. Pink quadrants `#fcf6fb` with `#e3c6dd` borders; blue quadrants `#f3f9fb` with `#c3dbe4` borders. Light theme only, on purpose: the presenter laptop's dark mode must never flip the slide on the projector. Colours sit in tokens on `:root`. 4.5:1 contrast for all text.
- **Layout:** designed for a 16:9 projector. The whole slide fits without scrolling at 1280×720 and 1920×1080, always laid out as 16:9, centred on wider screens. The two map rows share the height equally, and a row grows only when its cards need the room, so a two-line card never gets clipped. Below 900px wide, everything still stacks and stays usable, but phone polish is not a goal.
- **Copy:** the axis and quadrant labels match the course slide word for word. The group speaks as "we" and "our". No exclamation marks, no emoji.
- **Do not add:** Prof. Roh's name, badge, watermark or copyright line; his tasks, placements or reasons; the deck's step navigation ("Welcome back · The map · …"); a slide number; scoring; voting on phones or laptops; timers; sound; confetti; drag and drop; dark mode; PWA install; settings.
- **Quality bar:** `npm run build` passes the type check, `npm test` passes, no console errors or warnings, works offline, fits 1280×720 with no scroll, works with a clicker or keyboard alone, and every card lands in the right quadrant.

## C — Context
- **Course:** MGMT 6110, Week 7, "The Map of Human-AI Collaboration", taught by Prof. Sungjong Roh at SMU Lee Kong Chian School of Business. His slide "Place a task · Your turn" is the visual reference. It carries a "do not circulate without the author's permission" watermark, so the group copies its layout and axis wording only.
- **The map:** columns split work by whether it has a right answer. Rows split it by whether people and AI must do it together or either can do it alone. The four cells name who leads.
- **Group:** Human-AI Group 8. The six tasks and their quadrants are the group's own choices (14 Oct 2026), set by the user.
- **Use:** shown live from a laptop on the classroom projector during the group's presentation, possibly driven by a presentation clicker.
- **Sibling projects:** `../daily-checklist` and `../first-app` use the same stack, tsconfig and README shape. Reuse the scaffold, not the content.
- **Deployment:** Vercel, like the sibling apps (static Vite build, `dist/` output), so the slide can also be opened from a link.
