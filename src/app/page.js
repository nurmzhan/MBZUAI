'use client'

import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'

/* ────────────────────────────────────────────────────────────
   Content. Everything the page says lives here, so the markup
   below stays about structure rather than text.
   ──────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'results', num: '01', label: 'Results' },
  { id: 'education', num: '02', label: 'Education' },
  { id: 'experience', num: '03', label: 'Experience' },
  { id: 'awards', num: '04', label: 'Awards' },
  { id: 'skills', num: '05', label: 'Skills' },
  { id: 'hobbies', num: '06', label: 'Away from school' },
  { id: 'contact', num: '07', label: 'Contact' },
]

const RESULTS = [
  { name: 'SAT', value: 1530, out: 1600, note: 'August 2026' },
  { name: 'GPA', value: 5, decimals: 1, out: '5.0', note: 'Gymnasium 27 — top mark in every subject' },
  { name: 'IELTS', value: 7.5, decimals: 1, out: 9, note: 'Academic' },
  { name: 'UNT', value: 122, out: 140, note: 'Unified National Testing, Kazakhstan' },
]

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'lead', label: 'Leadership' },
  { id: 'build', label: 'Building' },
  { id: 'teach', label: 'Teaching' },
]

const EXPERIENCE = [
  {
    year: '2026', start: 'Aug 2026', end: 'now', kind: 'role', tags: ['lead'],
    role: 'Student Council', org: 'Nazarbayev University, Astana',
    points: [
      'Represent Foundation-year students on the university Student Council',
      'Carrying over the method that worked at school: open feedback sessions first, written proposals second',
      'Helping run council events for a cohort that has just arrived in a new city',
    ],
  },
  {
    year: '2025', start: 'Sep 2025', end: 'Jun 2026', kind: 'role', tags: ['lead'],
    role: 'School President', org: 'Gymnasium 27, Almaty',
    points: [
      'Ran student forums that collected feedback on teaching, school life and wellbeing',
      'Worked with the administration on exam support sessions and facility repairs',
      'Organised school-wide events, and set up formats that let other students run their own projects',
    ],
  },
  {
    year: '2025', start: 'Jul 2025', end: 'Jan 2026', kind: 'role', tags: ['build'],
    role: 'Website Developer', org: 'Russell ISC',
    points: [
      'Built and launched websites for academic programmes and events',
      'Set up analytics to track traffic and engagement',
      'Supported IT operations across departments',
    ],
  },
  {
    year: '2025', start: 'Jan 2025', end: 'Mar 2025', kind: 'volunteer', tags: ['teach'],
    role: 'Online English Tutor', org: 'Volunteer — two students, Abay region',
    points: [
      'Taught two students from a rural school, free of charge',
      'Wrote a study plan for each of them rather than a shared one',
      'Ran speaking practice sessions to build fluency and confidence',
    ],
  },
  {
    year: '2024', start: 'Dec 2024', end: 'May 2025', kind: 'volunteer', tags: ['teach', 'lead'],
    role: 'Curator, Kazakh Language Club TIL', org: 'Volunteer — mentoring and tutoring',
    points: [
      'Taught supplementary classes for junior students',
      'Designed the lesson plans and tracked each student’s progress',
      'Kept attendance up by building the sessions around activities, not lectures',
    ],
  },
  {
    year: '2024', start: 'Jun 2024', end: 'Aug 2024', kind: 'role', tags: ['build'],
    role: 'Website Developer', org: 'Narxoz University Finance Club',
    points: [
      'Rebuilt the site structure and made it work properly on phones',
      'Implemented front-end features and fixed outstanding bugs',
      'Worked to the club’s deadlines alongside the rest of the team',
    ],
  },
  {
    year: '2023', start: 'Sep 2023', end: 'Jun 2025', kind: 'role', tags: ['lead'],
    role: 'Leader, School Parliamentary Faction', org: 'Gymnasium 27, Almaty',
    points: [
      'Gathered student opinion through surveys and open meetings',
      'Turned it into written proposals and presented them to school leadership',
      'Chaired sessions and followed up until decisions actually landed',
    ],
  },
]

const AWARDS = [
  { rank: 'Altyn Belgi', what: 'Kazakhstan’s state “gold badge” for graduating school at the top mark in every subject' },
  { rank: '1st place', what: 'National Mathematics Competition “Kangaroo”' },
  { rank: '2nd place', what: 'District Mathematics Olympiad, grade 10' },
  { rank: '3rd place', what: 'District Mathematics Olympiad, grade 11' },
  { rank: 'Semifinalist', what: 'City interschool debate tournament' },
  { rank: 'Best Graduate', what: 'Named best gymnasium graduate by the school administration' },
  { rank: 'Top 1% worldwide', what: 'Sudoku solving times — expert, hard and easy modes' },
]

const TECH_SKILLS = [
  'Python, C, HTML',
  'Website development and deployment',
  'Google Analytics',
  'Notion, Miro, Trello',
  'Microsoft Office',
]

const CORE_SKILLS = [
  'Student leadership and talking to people who can change things',
  'Tutoring and mentoring younger students',
  'Designing lessons and learning plans',
  'Coordinating projects from proposal to follow-up',
  'Event planning and community organising',
]

/* ────────────────────────────────────────────────────────────
   Small shared hooks
   ──────────────────────────────────────────────────────────── */

// True once the element has been scrolled into view, and stays
// true afterwards. If there is no IntersectionObserver we say
// yes immediately, so nothing can get stuck hidden or at zero.
function useSeen(ref) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); io.disconnect() } },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return seen
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const seen = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0))
        let best = null, bestRatio = 0
        seen.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; best = id } })
        if (best) setActive(best)
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: [0, 0.2, 0.6, 1] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

/* ────────────────────────────────────────────────────────────
   Scores. The real number is in the markup from the first
   render, so the page is correct before any JavaScript runs;
   the count-up only starts once the figure scrolls into view.
   ──────────────────────────────────────────────────────────── */

function Odometer({ value, decimals = 0 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const seen = useSeen(ref)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (reduce || !seen) return
    let raf = 0
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - start) / 850)
      setShown(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
      else setShown(value)
    }
    setShown(0)
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, value, reduce])

  return <span ref={ref}>{shown.toFixed(decimals)}</span>
}

function LocalClock() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const read = () => {
      try {
        setNow(new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit', hour12: false,
        }).format(new Date()))
      } catch { /* no Intl time zones — just leave it out */ }
    }
    read()
    const id = setInterval(read, 20000)
    return () => clearInterval(id)
  }, [])
  if (!now) return null
  return (
    <span className="hero-place">
      <span className="clock-dot" aria-hidden="true" />
      {now} in Astana, where I am now
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   Sudoku. Nurymzhan is in the top 1% worldwide, so the grid is
   a real puzzle rather than a decoration: the base solution is
   reshuffled by band, stack, transpose and symbol relabelling,
   and the board is checked against the rules of sudoku rather
   than against one stored answer — so any valid solution wins.
   The clock starts on your first digit, and your best time is
   kept in your own browser.
   ──────────────────────────────────────────────────────────── */

const BASE_SOLUTION =
  '681594327' + '597283416' + '342671589' +
  '934157268' + '278936145' + '156842973' +
  '729318654' + '813465792' + '465729831'

const CLUE_COUNT = 34
const BEST_KEY = 'nb-sudoku-best-v1'

function shuffled(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const transpose = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]))

function permuteRows(rows) {
  const out = []
  shuffled([0, 1, 2]).forEach((band) => {
    shuffled([0, 1, 2]).forEach((r) => out.push(rows[band * 3 + r]))
  })
  return out
}

function makeSolution() {
  let rows = []
  for (let r = 0; r < 9; r++) {
    rows.push(BASE_SOLUTION.slice(r * 9, r * 9 + 9).split('').map(Number))
  }
  rows = permuteRows(rows)
  rows = transpose(permuteRows(transpose(rows)))
  const relabel = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])
  rows = rows.map((row) => row.map((v) => relabel[v - 1]))
  if (Math.random() < 0.5) rows = transpose(rows)
  return rows.flat()
}

const GROUPS = (() => {
  const g = []
  for (let r = 0; r < 9; r++) g.push(Array.from({ length: 9 }, (_, c) => r * 9 + c))
  for (let c = 0; c < 9; c++) g.push(Array.from({ length: 9 }, (_, r) => r * 9 + c))
  for (let b = 0; b < 9; b++) {
    g.push(Array.from({ length: 9 }, (_, k) =>
      (Math.floor(b / 3) * 3 + Math.floor(k / 3)) * 9 + (b % 3) * 3 + (k % 3)
    ))
  }
  return g
})()

function findConflicts(cells) {
  const bad = new Set()
  for (const group of GROUPS) {
    const seen = new Map()
    for (const i of group) {
      const v = cells[i]
      if (!v) continue
      if (!seen.has(v)) seen.set(v, [])
      seen.get(v).push(i)
    }
    for (const list of seen.values()) {
      if (list.length > 1) list.forEach((i) => bad.add(i))
    }
  }
  return bad
}

function clock(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function SudokuGame() {
  const [givens, setGivens] = useState(null)
  const [entries, setEntries] = useState(() => Array(81).fill(0))
  const [startedAt, setStartedAt] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(null)
  const [best, setBest] = useState(null)

  const deal = useCallback(() => {
    const solution = makeSolution()
    const revealed = new Set(shuffled(Array.from({ length: 81 }, (_, i) => i)).slice(0, CLUE_COUNT))
    setGivens(solution.map((v, i) => (revealed.has(i) ? v : 0)))
    setEntries(Array(81).fill(0))
    setStartedAt(null)
    setElapsed(0)
    setFinished(null)
  }, [])

  // Deal on the client only, so the server and the first client
  // render agree and React does not report a hydration mismatch.
  useEffect(() => { deal() }, [deal])

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(BEST_KEY))
      if (saved > 0) setBest(saved)
    } catch { /* private browsing, or storage blocked */ }
  }, [])

  useEffect(() => {
    if (startedAt == null || finished != null) return
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 500)
    return () => clearInterval(id)
  }, [startedAt, finished])

  const cells = useMemo(
    () => (givens ? givens.map((g, i) => (g || entries[i])) : Array(81).fill(0)),
    [givens, entries]
  )
  const conflicts = useMemo(() => findConflicts(cells), [cells])
  const filled = cells.filter(Boolean).length
  const solved = filled === 81 && conflicts.size === 0

  useEffect(() => {
    if (!solved || finished != null) return
    const secs = startedAt == null ? 0 : Math.round((Date.now() - startedAt) / 1000)
    setFinished(secs)
    if (best == null || secs < best) {
      setBest(secs)
      try { window.localStorage.setItem(BEST_KEY, String(secs)) } catch { /* ignore */ }
    }
  }, [solved, finished, startedAt, best])

  const setCell = (i, raw) => {
    const digit = raw.replace(/[^1-9]/g, '').slice(-1)
    if (digit && startedAt == null && finished == null) setStartedAt(Date.now())
    setEntries((prev) => {
      const next = [...prev]
      next[i] = digit ? Number(digit) : 0
      return next
    })
  }

  const status = finished != null
    ? `Solved in ${clock(finished)}.`
    : conflicts.size
      ? `${conflicts.size} cells conflict — a digit repeats in a row, column or box.`
      : `${81 - filled} squares left.`

  return (
    <div className="sudoku-wrap">
      <div className="sudoku-clock">
        <span className="sudoku-time" data-running={startedAt != null && finished == null}>
          {clock(finished != null ? finished : elapsed)}
        </span>
        <span className="sudoku-best">
          {best != null ? `your best ${clock(best)}` : 'the clock starts on your first digit'}
        </span>
      </div>

      <table className="sudoku">
        <caption className="sr-only">Sudoku puzzle, 9 by 9. Type a digit from 1 to 9 into an empty square.</caption>
        <tbody>
          {Array.from({ length: 9 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: 9 }, (_, col) => {
                const i = row * 9 + col
                const given = givens ? givens[i] : 0
                const cls = [
                  (col + 1) % 3 === 0 && col !== 8 ? 'edge-r' : '',
                  (row + 1) % 3 === 0 && row !== 8 ? 'edge-b' : '',
                ].filter(Boolean).join(' ')

                return (
                  <td key={col} className={cls}>
                    {given ? (
                      <span className="given">{given}</span>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={1}
                        className={conflicts.has(i) ? 'bad' : undefined}
                        value={entries[i] || ''}
                        onChange={(e) => setCell(i, e.target.value)}
                        aria-label={`Row ${row + 1}, column ${col + 1}`}
                        aria-invalid={conflicts.has(i) || undefined}
                      />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sudoku-bar">
        <button type="button" className="btn btn-ghost" onClick={deal}>New puzzle</button>
        <p className="sudoku-status" role="status" data-state={solved ? 'solved' : conflicts.size ? 'error' : 'idle'}>
          {status}
        </p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────── */

function SectionHead({ num, kicker, title, children }) {
  return (
    <div className="section-head">
      <p className="kicker"><span className="kicker-num">{num}</span>{kicker}</p>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const reduce = useReducedMotion()
  const ids = useMemo(() => SECTIONS.map((s) => s.id), [])
  const active = useActiveSection(ids)
  const { scrollYProgress } = useScroll()

  // The only motion on this page that nobody asked for: the
  // masthead settling once on load. Everything else waits for you.
  const enter = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] },
        }

  const shown = useMemo(
    () => (filter === 'all' ? EXPERIENCE : EXPERIENCE.filter((e) => e.tags.includes(filter))),
    [filter]
  )

  let lastYear = null

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      {!reduce && (
        <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      )}

      <header className="topbar">
        <div className="topbar-in">
          <a className="topbar-name" href="#top">Nurymzhan Baktygali</a>
          <nav className="topbar-links" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} data-active={active === s.id}>{s.label}</a>
            ))}
          </nav>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Close' : 'Sections'}
          </button>
        </div>
        {menuOpen && (
          <div className="menu-panel" id="mobile-nav">
            <nav className="menu-panel-in" aria-label="Sections">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setMenuOpen(false)}>{s.label}</a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="shell hero-grid">
            <div>
              <motion.h1 className="hero-name" {...enter(0)}>
                <span>Nurymzhan</span>
                <span className="surname">Baktygali</span>
              </motion.h1>

              <motion.p className="hero-intro" {...enter(0.12)}>
                I finished Gymnasium 27 in Almaty with <em>Altyn Belgi</em>, Kazakhstan’s state
                gold certificate, and I am now in the Foundation Year at Nazarbayev University
                in Astana, where I sit on the Student Council. I am applying to MBZUAI for the
                BSc in Artificial Intelligence (Business).
              </motion.p>

              <motion.div className="hero-meta" {...enter(0.22)}>
                <a className="btn btn-solid" href="/cv.pdf" download="Nurymzhan-Baktygali-CV.pdf">
                  Download CV (PDF)
                </a>
                <a className="btn btn-ghost" href="mailto:baktygali.nurymzhan@gmail.com">
                  Email me
                </a>
                <LocalClock />
              </motion.div>
            </div>

            <motion.figure className="portrait" style={{ margin: 0 }} {...enter(0.3)}>
              <img src="/profile-photo.jpg" alt="Nurymzhan Baktygali" width={600} height={750} />
              <figcaption>Almaty, 2025</figcaption>
            </motion.figure>
          </div>
        </section>

        <section className="section" id="results">
          <div className="shell">
            <SectionHead num="01" kicker="Results" title="The numbers, in full">
            </SectionHead>

            <ul className="scores">
              {RESULTS.map((r) => (
                <li key={r.name} className="score-card">
                  <p className="score-label">{r.name}</p>
                  <p className="score-value" aria-hidden="true">
                    <span className="score-num"><Odometer value={r.value} decimals={r.decimals || 0} /></span>
                    <span className="score-out">/ {r.out}</span>
                  </p>
                  <span className="sr-only">{r.name}: {r.decimals ? r.value.toFixed(r.decimals) : r.value} out of {r.out}.</span>
                  <p className="score-note">{r.note}</p>
                </li>
              ))}
            </ul>

            <div className="honour">
              <p className="honour-kicker">State award — Republic of Kazakhstan</p>
              <h3 className="honour-title">
                Altyn Belgi <span className="cyr" lang="kk">Алтын белгі</span>
              </h3>
              <p className="honour-body">
                The national “gold badge”, given to school leavers who finish with the top mark
                in every subject across their final years. Mine came with a 5.0 out of 5.0
                record at Gymnasium 27 — it is the one line on this page that cannot be
                partially earned.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="education">
          <div className="shell">
            <SectionHead num="02" kicker="Education" title="Where I have studied" />
            <div className="cols three">
              <div className="block block-now">
                <h3>Nazarbayev University</h3>
                <p className="block-sub">Foundation Year, Astana — current</p>
                <dl>
                  <dt>Programme</dt>
                  <dd>The university’s pre-undergraduate year: academic English, mathematics and sciences taught in English.</dd>
                  <dt>Alongside it</dt>
                  <dd>Elected to the Student Council.</dd>
                </dl>
              </div>
              <div className="block">
                <h3>Gymnasium 27</h3>
                <p className="block-sub">Almaty, Kazakhstan — graduated 2026</p>
                <dl>
                  <dt>Programme</dt>
                  <dd>Trilingual academic track, with advanced coursework in mathematics, physics and geography.</dd>
                  <dt>Leaving record</dt>
                  <dd>GPA 5.0 out of 5.0, diploma with distinction, and <em>Altyn Belgi</em>.</dd>
                </dl>
              </div>
              <div className="block">
                <h3>Harvard University</h3>
                <p className="block-sub">CS50: Introduction to Computer Science — online</p>
                <dl>
                  <dt>Covered</dt>
                  <dd>C, Python, algorithms and data structures, with weekly problem sets.</dd>
                  <dt>Why it mattered</dt>
                  <dd>It was the first time I had to make a program work, not just make it look right.</dd>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="shell">
            <SectionHead num="03" kicker="Experience" title="What I have actually done">
              <p>
                Paid work and volunteering, newest first. I have not had a gap since
                September 2023, and several of these overlap. Filter it if you are
                only here for one kind of thing.
              </p>
            </SectionHead>

            <div className="chips" role="group" aria-label="Filter experience">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="chip"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                  <span className="chip-count">
                    {f.id === 'all' ? EXPERIENCE.length : EXPERIENCE.filter((e) => e.tags.includes(f.id)).length}
                  </span>
                </button>
              ))}
            </div>

            <ol className="timeline" key={filter}>
              {shown.map((item, i) => {
                const showYear = item.year !== lastYear
                lastYear = item.year
                return (
                  <Fragment key={i}>
                  {showYear && <li className="tl-year" aria-hidden="true">{item.year}</li>}
                  <li className="tl-item" data-kind={item.kind} style={{ '--i': i }}>
                    <div className="tl-when">{item.start} — {item.end}</div>
                    <h3 className="tl-role">{item.role}</h3>
                    <p className="tl-org">{item.org}</p>
                    <ul>{item.points.map((p, k) => <li key={k}>{p}</li>)}</ul>
                  </li>
                  </Fragment>
                )
              })}
            </ol>

            <p className="legend">
              <span><i /> Paid or elected role</span>
              <span><i className="filled" /> Volunteer</span>
            </p>
          </div>
        </section>

        <section className="section" id="awards">
          <div className="shell">
            <SectionHead num="04" kicker="Awards" title="Competitions and honours" />
            <ul className="awards">
              {AWARDS.map((a) => (
                <li key={a.rank + a.what}>
                  <span className="rank">{a.rank}</span>
                  <span className="what">{a.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="shell">
            <SectionHead num="05" kicker="Skills" title="What I bring to a room" />
            <div className="cols">
              <div className="block">
                <h3>Technical</h3>
                <p className="block-sub">What I build with</p>
                <ul>{TECH_SKILLS.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              <div className="block">
                <h3>Working with people</h3>
                <p className="block-sub">What the roles above actually needed</p>
                <ul>{CORE_SKILLS.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="hobbies">
          <div className="shell">
            <SectionHead num="06" kicker="Away from school" title="Four things not on a transcript">
              <p>
                Three of them are about getting a movement exactly right. The fourth is
                about getting a number exactly right — and you can play that one.
              </p>
            </SectionHead>

            <div className="hobby">
              <div className="hobby-head">
                <h3>Parkour</h3>
                <span className="hobby-note">Almaty, filmed 2025</span>
              </div>
              <div className="media-pair">
                <div className="frame">
                  <video controls preload="metadata" playsInline poster="/parkour-thumbnail.jpg">
                    <source src="/parkour-video.mp4" type="video/mp4" />
                    Your browser cannot play this video.
                  </video>
                </div>
                <div className="frame">
                  <video controls preload="metadata" playsInline poster="/parkour-thumbnail-2.jpg">
                    <source src="/parkour-video-2.mp4" type="video/mp4" />
                    Your browser cannot play this video.
                  </video>
                </div>
              </div>
              <p>
                You commit to a jump before you know it will work, and you only get to
                commit once. It has taught me more about judging risk than anything in a
                classroom has.
              </p>
            </div>

            <div className="hobby">
              <div className="hobby-head">
                <h3>Hiking</h3>
                <span className="hobby-note">Zailiysky Alatau, above Almaty</span>
              </div>
              <div className="media-trio">
                <div className="frame"><img src="/hiking-1.jpg" alt="On a trail in the mountains above Almaty" loading="lazy" /></div>
                <div className="frame"><img src="/hiking-2.jpg" alt="A ridge in the Zailiysky Alatau" loading="lazy" /></div>
                <div className="frame"><img src="/hiking-3.jpg" alt="A view back down the valley towards Almaty" loading="lazy" /></div>
              </div>
              <p>
                The mountains start where the city ends, so a long walk is always available.
                It is where I think through things that will not resolve at a desk.
              </p>
            </div>

            <div className="hobby">
              <div className="hobby-head">
                <h3>Ukulele</h3>
                <span className="hobby-note">Self-taught</span>
              </div>
              <div className="media-pair">
                <div className="frame">
                  <video controls preload="metadata" playsInline poster="/ukulele-thumbnail.jpg">
                    <source src="/ukulele-video.mp4" type="video/mp4" />
                    Your browser cannot play this video.
                  </video>
                </div>
                <div className="frame">
                  <video controls preload="metadata" playsInline poster="/ukulele-thumbnail-2.jpg">
                    <source src="/ukulele-video-2.mp4" type="video/mp4" />
                    Your browser cannot play this video.
                  </video>
                </div>
              </div>
              <p>
                Four strings, no theory, and a short walk from not knowing a song to playing
                it badly. It is the one thing I do where being approximately right is enough.
              </p>
            </div>

            <div className="hobby">
              <div className="hobby-head">
                <h3>Sudoku</h3>
                <span className="hobby-note">Top 1% worldwide — try to beat the clock</span>
              </div>
              <SudokuGame />
              <p>
                A real puzzle, reshuffled every time you press the button, checked against the
                rules rather than against one stored answer — so any valid solution counts.
                Your best time stays in your own browser; nothing is sent anywhere.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="shell">
            <SectionHead num="07" kicker="Contact" title="Get in touch" />
            <div className="contact-grid">
              <div className="prose">
                <p>
                  I am applying to MBZUAI for the BSc in Artificial Intelligence (Business).
                  If you are reading this as part of an application, the CV at the top has the
                  same record in one page.
                </p>
                <p>
                  I also answer messages about web work, tutoring, and anything to do with
                  student government. I write in English, Kazakh and Russian.
                </p>
                <p>
                  <a className="btn btn-solid" href="mailto:baktygali.nurymzhan@gmail.com">
                    Email me
                  </a>
                </p>
              </div>

              <ul className="contact-list">
                <li>
                  <span className="label">Email</span>
                  <a className="value" href="mailto:baktygali.nurymzhan@gmail.com">baktygali.nurymzhan@gmail.com</a>
                </li>
                <li>
                  <span className="label">Phone</span>
                  <a className="value" href="tel:+77475536232">+7 747 553 62 32</a>
                </li>
                <li>
                  <span className="label">Based in</span>
                  <span className="value">Astana during term · Almaty at home</span>
                </li>
                <li>
                  <span className="label">Languages</span>
                  <span className="value">Kazakh, Russian, English</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="shell">
          <p>© 2026 Nurymzhan Baktygali — Astana and Almaty, Kazakhstan.</p>
        </div>
      </footer>
    </>
  )
}
