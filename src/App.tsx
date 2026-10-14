import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { inQuadrant, lastPlaced, nextUnplaced, place, statusLine, unplace } from './placement.ts'
import { COLUMNS, QUADRANTS, ROWS, TASKS, type QuadrantId } from './tasks.ts'

const FLIGHT_MS = 450
const GLOW_MS = 900
const SHOW_ALL_STEP_MS = 150

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [placed, setPlaced] = useState<string[]>([])
  const [shown, setShown] = useState<string | null>(null)

  // Mirror of `placed` so timers and key handlers never read a stale value.
  const placedRef = useRef<string[]>([])
  placedRef.current = placed

  // The element currently showing each card (tray chip or map chip), and each quadrant.
  const cardEls = useRef(new Map<string, HTMLElement>())
  const quadEls = useRef(new Map<QuadrantId, HTMLElement>())
  // Cards that have just moved: where they were on screen before the move.
  const flights = useRef(new Map<string, { from: DOMRect; glow?: QuadrantId; hadFocus: boolean }>())
  const timers = useRef<number[]>([])

  const cardRef = (id: string) => (el: HTMLElement | null) => {
    if (el) cardEls.current.set(id, el)
    else if (cardEls.current.get(id)?.isConnected === false) cardEls.current.delete(id)
  }

  const recordFlight = (id: string, glow?: QuadrantId) => {
    const el = cardEls.current.get(id)
    if (el) flights.current.set(id, { from: el.getBoundingClientRect(), glow, hadFocus: el.contains(document.activeElement) })
  }

  // FLIP: after React moves a card, start it where it was and glide it home.
  useLayoutEffect(() => {
    if (flights.current.size === 0) return
    const animate = !reducedMotion()
    for (const [id, { from, glow, hadFocus }] of flights.current) {
      const el = cardEls.current.get(id)
      // Keyboard users keep their place: after placing, focus the next tray card;
      // after sending a card back, focus it in the tray.
      if (hadFocus) {
        const next = glow && nextUnplaced(placedRef.current, TASKS)
        ;(next ? cardEls.current.get(next.id) : el)?.focus()
      }
      if (el && animate) {
        const to = el.getBoundingClientRect()
        const dx = from.left - to.left
        const dy = from.top - to.top
        el.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)`, boxShadow: '0 10px 28px rgba(20,40,75,.22)' },
            { transform: 'translate(0, 0)', boxShadow: '0 0 0 rgba(20,40,75,0)' },
          ],
          { duration: FLIGHT_MS, easing: 'cubic-bezier(.2,.8,.2,1)' },
        )
      }
      const q = glow && quadEls.current.get(glow)
      if (q && animate) {
        const c = getComputedStyle(q).getPropertyValue('--glow').trim()
        q.animate(
          [
            { boxShadow: `0 0 0 0 ${c}` },
            { boxShadow: `0 0 0 6px ${c}`, offset: 0.35 },
            { boxShadow: `0 0 0 0 ${c}` },
          ],
          { duration: GLOW_MS, delay: FLIGHT_MS * 0.6, easing: 'ease-out' },
        )
      }
    }
    flights.current.clear()
  }, [placed])

  const placeCard = useCallback((id: string) => {
    if (placedRef.current.includes(id)) return
    const task = TASKS.find((t) => t.id === id)
    if (!task) return
    recordFlight(id, task.quadrant)
    placedRef.current = place(placedRef.current, id)
    setPlaced(placedRef.current)
    setShown(id)
  }, [])

  const returnCard = useCallback((id: string) => {
    if (!placedRef.current.includes(id)) return
    recordFlight(id)
    placedRef.current = unplace(placedRef.current, id)
    setPlaced(placedRef.current)
    // If its reason was showing, show the card placed before it instead.
    setShown((s) => (s === id ? (lastPlaced(placedRef.current) ?? null) : s))
  }, [])

  const cancelTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const showAll = () => {
    cancelTimers()
    const remaining = TASKS.filter((t) => !placedRef.current.includes(t.id))
    remaining.forEach((t, i) => {
      timers.current.push(window.setTimeout(() => placeCard(t.id), i * SHOW_ALL_STEP_MS))
    })
  }

  const clearAll = () => {
    cancelTimers()
    placedRef.current.forEach((id) => recordFlight(id))
    placedRef.current = []
    setPlaced([])
    setShown(null)
  }

  useEffect(() => cancelTimers, [])

  // Presentation clickers send these keys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const forward = ['ArrowRight', 'ArrowDown', 'PageDown', ' ']
      const back = ['ArrowLeft', 'ArrowUp', 'PageUp']
      if (!forward.includes(e.key) && !back.includes(e.key)) return
      // Space on a focused button should press that button, as normal.
      if (e.key === ' ' && e.target instanceof HTMLButtonElement) return
      e.preventDefault()
      if (forward.includes(e.key)) {
        const next = nextUnplaced(placedRef.current, TASKS)
        if (next) placeCard(next.id)
      } else {
        const last = lastPlaced(placedRef.current)
        if (last) returnCard(last)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [placeCard, returnCard])

  const shownTask = TASKS.find((t) => t.id === shown)
  const shownQuadrant = shownTask && QUADRANTS.find((q) => q.id === shownTask.quadrant)

  return (
    <main className="slide">
      <p className="kicker">Place a task · Your turn</p>
      <h1 className="title">Where would you place each of these tasks, and who should lead it?</h1>
      <p className="subtitle">
        Call the quadrant for each task before we click. The placements are our group's view, and you may
        well place some differently.
      </p>

      <section className="panel" aria-label="Map of human-AI collaboration">
        <header className="panel-head">
          <span className="badge">
            <span className="badge-dot" aria-hidden="true" />
            Human-AI Group 8
          </span>
          <span className="status" aria-live="polite">
            {statusLine(placed.length, TASKS.length)}
          </span>
        </header>

        <div className="map">
          <span className="corner" aria-hidden="true" />
          <h2 className="col-head">{COLUMNS['right-answer']}</h2>
          <h2 className="col-head">{COLUMNS['no-single-answer']}</h2>
          {(['together', 'alone'] as const).map((row) => (
            <Row key={row} row={row}>
              {QUADRANTS.filter((q) => q.row === row).map((q) => (
                <div
                  key={q.id}
                  className={`quad quad-${q.tone}`}
                  ref={(el) => {
                    if (el) quadEls.current.set(q.id, el)
                  }}
                >
                  <h3 className="quad-name">{q.name}</h3>
                  <div className="quad-cards">
                    {inQuadrant(placed, TASKS, q.id).map((t) => (
                      <span key={t.id} ref={cardRef(t.id)} className="placed">
                        <button
                          className={`card card-placed${t.id === shown ? ' card-current' : ''}`}
                          onClick={() => setShown(t.id)}
                          aria-pressed={t.id === shown}
                        >
                          {t.label}
                        </button>
                        <button
                          className="card-x"
                          onClick={() => returnCard(t.id)}
                          aria-label={`Send ${t.label} back to the tray`}
                          title="Send back to the tray"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Row>
          ))}
        </div>

        <div className="reason" aria-live="polite">
          {shownTask && shownQuadrant ? (
            <p>
              <strong>{shownTask.label}</strong>
              <span className="reason-where"> lands in {shownQuadrant.name}.</span> {shownTask.reason}
            </p>
          ) : (
            <p className="reason-idle">Pick a task below to start.</p>
          )}
        </div>

        <div className="tray">
          {TASKS.map((t) =>
            placed.includes(t.id) ? (
              <span key={t.id} className="card card-slot" aria-hidden="true">
                {t.label}
              </span>
            ) : (
              <button key={t.id} ref={cardRef(t.id)} className="card" onClick={() => placeCard(t.id)}>
                {t.label}
              </button>
            ),
          )}
          <button className="btn btn-solid" onClick={showAll} disabled={placed.length === TASKS.length}>
            Show all
          </button>
          <button className="btn" onClick={clearAll} disabled={placed.length === 0}>
            Clear
          </button>
        </div>
      </section>

      <footer className="foot">
        <span>MGMT 6110 · Week 7 · The Map of Human-AI Collaboration</span>
        <span>Human-AI Group 8 · SMU Lee Kong Chian School of Business</span>
      </footer>
    </main>
  )
}

function Row({ row, children }: { row: 'together' | 'alone'; children: ReactNode }) {
  return (
    <>
      <h2 className="row-head">{ROWS[row]}</h2>
      {children}
    </>
  )
}
