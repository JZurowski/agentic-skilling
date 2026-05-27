// measure.jsx — Measure page: outcome banner, metrics, per-learner table

const PROGRAM = {
  name: "SQL for Senior PMs",
  cohortSize: 18,
  started: "May 1, 2026",
  weeksIn: 3,
  totalWeeks: 4,
  los: [
    { num: 1, name: "Joins" },
    { num: 2, name: "Aggregations & GROUP BY" },
    { num: 3, name: "Subqueries" },
    { num: 4, name: "Window functions" },
    { num: 5, name: "Query optimization" },
  ],
};

// LO state: 1=mastered, 2=attempted-not-mastered, 0=not-yet-attempted
const LEARNERS = [
  { name: "Aisha Patel",     lastActive: "7 min ago",    pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Marcus Chen",     lastActive: "23 min ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Sofia Rodriguez", lastActive: "41 min ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "James O'Brien",   lastActive: "1 hour ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Priya Krishnan",  lastActive: "2 hours ago",  pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "David Lee",       lastActive: "4 hours ago",  pct: 96,  module: "Module 5: Query optimization", lesson: "Lesson 3 · Index strategy", los: [1,1,1,1,2] },
  { name: "Maya Goldstein",  lastActive: "6 hours ago",  pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Tyrone Williams", lastActive: "Yesterday",    pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Hiroshi Tanaka",  lastActive: "Yesterday",    pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Elena Volkov",    lastActive: "2 days ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Daniel Park",     lastActive: "2 days ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Olivia Bennett",  lastActive: "3 days ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Rajesh Kumar",    lastActive: "3 days ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Sarah Mitchell",  lastActive: "4 days ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Kenji Yamamoto",  lastActive: "5 days ago",   pct: 88,  module: "Module 4: Window functions", lesson: "Lesson 4 · Ranking & frames",     los: [1,1,1,2,0] },
  { name: "Chloé Dubois",    lastActive: "1 week ago",   pct: 100, module: "Capstone", lesson: "Submitted",                  los: [1,1,1,1,1] },
  { name: "Andre Johnson",   lastActive: "1 week ago",   pct: 76,  module: "Module 4: Window functions", lesson: "Lesson 1 · OVER and PARTITION BY", los: [1,1,1,0,0] },
  { name: "Léa Hassan",      lastActive: "2 weeks ago",  pct: 54,  module: "Module 3: Subqueries", lesson: "Lesson 2 · Correlated subqueries", los: [1,1,2,0,0] },
];

const masteredCount = LEARNERS.filter(l => l.los.every(s => s === 1)).length;

// ----- Outcome banner -----
const OutcomeBanner = ({ visible, onDismiss }) => {
  const [choice, setChoice] = React.useState(null);
  const [note, setNote] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  if (!visible) return null;

  const expandNote = choice === "partial" || choice === "no";

  if (confirmed) {
    return (
      <div className="outcome-banner confirmed">
        <div className="ob-left">
          <span className="ob-tag">
            <span className="ico"><i className="fa-solid fa-check"></i></span>
            Outcome recorded
          </span>
          <h2 className="ob-headline">
            Thanks — your assessment is filed against this program.
          </h2>
          <p className="ob-sub">
            We'll use it to tune future runs. Find this and all evidence in the program's <a href="#">Evidence locker</a>.
          </p>
        </div>
        <button className="ob-dismiss" onClick={onDismiss} aria-label="Dismiss"><i className="fa-solid fa-xmark"></i></button>
      </div>
    );
  }

  return (
    <div className="outcome-banner">
      <div className="ob-left">
        <span className="ob-tag">
          <span className="ico"><i className="fa-solid fa-check"></i></span>
          Outcome milestone · 80% mastery reached
        </span>
        <h2 className="ob-headline">
          <strong>{masteredCount} of {LEARNERS.length} learners</strong> have mastered this program. Did it achieve your outcome?
        </h2>
        <p className="ob-sub">
          Your call here is filed against the program and shapes the next iteration. You can always come back to this from the Evidence locker.
        </p>
      </div>
      <div className="ob-actions">
        <button className={`ob-btn yes ${choice === "yes" ? "active" : ""}`} onClick={() => { setChoice("yes"); setConfirmed(true); }}>
          <span className="ic"><i className="fa-solid fa-check"></i></span>
          Yes
        </button>
        <button className={`ob-btn partial ${choice === "partial" ? "active" : ""}`} onClick={() => setChoice("partial")}>
          <span className="ic"><i className="fa-solid fa-minus"></i></span>
          Partial
        </button>
        <button className={`ob-btn no ${choice === "no" ? "active" : ""}`} onClick={() => setChoice("no")}>
          <span className="ic"><i className="fa-solid fa-xmark"></i></span>
          No
        </button>
      </div>

      {expandNote && (
        <div className="ob-note">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What worked, what didn't? Optional, but helps the next program."
          ></textarea>
          <button className="btn btn-primary btn-sm" onClick={() => setConfirmed(true)} style={{ marginTop: 4 }}>
            <i className="fa-solid fa-paper-plane"></i> Send
          </button>
        </div>
      )}

      <button className="ob-dismiss" onClick={onDismiss} aria-label="Dismiss"><i className="fa-solid fa-xmark"></i></button>
    </div>
  );
};

// ----- Metric card -----
const MetricCard = ({ label, value, denom, caption, miniPct, tone, trend, trendDir = "up", icon }) => (
  <div className={`metric-card ${tone || ""}`}>
    <div className="m-label">
      {icon && <i className={`ic ${icon}`}></i>}
      {label}
    </div>
    <div className="m-value">
      {value}
      {denom && <span className="denom"> / {denom}</span>}
    </div>
    {caption && <div className="m-caption">{caption}</div>}
    {miniPct != null && (
      <div className="m-mini"><span style={{ width: `${miniPct}%` }}></span></div>
    )}
    {trend && (
      <span className={`m-trend ${trendDir === "down" ? "down" : ""}`}>
        <i className={`fa-solid ${trendDir === "down" ? "fa-arrow-down" : "fa-arrow-up"}`}></i>
        {trend}
      </span>
    )}
  </div>
);

const MetricsBand = () => {
  const activeThisWeek = LEARNERS.filter(l =>
    /min|hour|yesterday|day|^[2-6] days/i.test(l.lastActive)
  ).length;
  const avgComplete = Math.round(LEARNERS.reduce((s, l) => s + l.pct, 0) / LEARNERS.length);
  const masteredLO1 = LEARNERS.filter(l => l.los[0] === 1).length;
  const summativeAttempted = 16;
  const summativePassed = 14;

  return (
    <div className="metrics-band">
      <MetricCard
        label="Active this week"
        value={activeThisWeek}
        denom={LEARNERS.length}
        caption={`${Math.round(activeThisWeek/LEARNERS.length*100)}% engagement`}
        miniPct={activeThisWeek/LEARNERS.length*100}
        tone="success"
        trend="+3"
      />
      <MetricCard
        label="Enrolled"
        value="100%"
        caption={`${LEARNERS.length} of ${LEARNERS.length} learners`}
        miniPct={100}
        tone="success"
      />
      <MetricCard
        label="Avg complete"
        value={`${avgComplete}%`}
        caption="Across the cohort"
        miniPct={avgComplete}
      />
      <MetricCard
        label="Mastered Module 1"
        value={`${Math.round(masteredLO1/LEARNERS.length*100)}%`}
        caption={`${masteredLO1} of ${LEARNERS.length} learners`}
        miniPct={masteredLO1/LEARNERS.length*100}
        tone="success"
      />
      <MetricCard
        label="Summative pass"
        value={summativePassed}
        denom={summativeAttempted}
        caption={`${Math.round(summativePassed/summativeAttempted*100)}% pass rate`}
        miniPct={summativePassed/summativeAttempted*100}
        tone="success"
      />
    </div>
  );
};

// ----- Learner table -----
const initials = (name) => name.split(/\s+/).slice(0,2).map(p => p[0]).join("").toUpperCase();

const LOBadge = ({ num, state, name }) => {
  const cls = state === 1 ? "mastered" : state === 2 ? "attempted" : "not-yet";
  const label = state === 1 ? "Mastered" : state === 2 ? "Attempted, not mastered" : "Not yet attempted";
  return (
    <span className={`lo-badge ${cls}`} title={`LO${num} · ${name} — ${label}`}>
      {num}
    </span>
  );
};

const isRecent = (s) => /min|hour/i.test(s);

const LearnerRow = ({ l }) => {
  const isDone = l.pct === 100;
  const barCls = l.pct >= 95 ? "" : l.pct >= 70 ? "in-progress" : "behind";
  return (
    <tr>
      <td>
        <div className="learner-name">
          <span className="avatar-sm">{initials(l.name)}</span>
          <span className="nm">{l.name}</span>
        </div>
      </td>
      <td className={`last-active ${isRecent(l.lastActive) ? "recent" : ""}`}>{l.lastActive}</td>
      <td>
        <div className="pct-cell">
          <span className="pct-val">{l.pct}%</span>
          <div className={`pct-bar ${barCls}`}>
            <span style={{ width: `${l.pct}%` }}></span>
          </div>
        </div>
      </td>
      <td>
        <div className={`current-location ${isDone ? "done" : ""}`}>
          <span className="module">{l.module}</span>
          <span className="lesson">{l.lesson}</span>
        </div>
      </td>
      <td>
        <div className="lo-row">
          {l.los.map((s, i) => (
            <LOBadge key={i} num={i + 1} state={s} name={PROGRAM.los[i].name} />
          ))}
        </div>
      </td>
    </tr>
  );
};

const LearnerTable = () => (
  <div className="table-card">
    <div className="table-head">
      <div className="title">
        <h3>Per-learner progress</h3>
        <div className="sub">{LEARNERS.length} learners · sorted by last active</div>
      </div>
      <div className="legend">
        <span className="item"><span className="legend-dot mastered"></span> Mastered</span>
        <span className="item"><span className="legend-dot attempted"></span> Attempted</span>
        <span className="item"><span className="legend-dot not-yet"></span> Not yet</span>
      </div>
    </div>
    <div style={{ overflowX: "auto" }}>
      <table className="learners-table">
        <thead>
          <tr>
            <th>Learner</th>
            <th>Last active <i className="fa-solid fa-arrow-down sort-ic"></i></th>
            <th>Complete</th>
            <th>Current</th>
            <th>Learning objectives</th>
          </tr>
        </thead>
        <tbody>
          {LEARNERS.map((l, i) => <LearnerRow key={i} l={l} />)}
        </tbody>
      </table>
    </div>
  </div>
);

// ----- Page -----
const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "showBanner": true,
  "showTrust": true
}/*EDITMODE-END*/;

const MeasureApp = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULS);
  const [bannerVisible, setBannerVisible] = React.useState(tweaks.showBanner);

  React.useEffect(() => setBannerVisible(tweaks.showBanner), [tweaks.showBanner]);

  const crumbs = [
    { label: "Programs", href: "Define.html" },
    { label: "Active programs" },
    { label: "SQL for Senior PMs", current: true },
  ];

  return (
    <div className="app">
      <Sidebar activeNav="active" />
      <TopBar
        crumbs={crumbs}
        status={`Live · Week ${PROGRAM.weeksIn} of ${PROGRAM.totalWeeks}`}
        statusTone="success"
        saveAction="Export report"
        saveIcon="fa-regular fa-file-arrow-down"
      />
      <main className="main">
        <div className="page page-measure">
          <div className="measure-head">
            <div>
              <div className="overline" style={{ font: "700 11px/1 var(--font-sans)", letterSpacing: 1.4, textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
                Active program · Step 4 of 4
              </div>
              <h1 style={{ font: "500 32px/1.15 var(--font-sans)", letterSpacing: "-0.005em", margin: 0 }}>
                {PROGRAM.name}
              </h1>
              <div className="program-meta">
                <span className="live-tag">
                  <span className="live-dot"></span>
                  In progress
                </span>
                <span>{PROGRAM.cohortSize}-learner cohort</span>
                <span className="pip"></span>
                <span>Week {PROGRAM.weeksIn} of {PROGRAM.totalWeeks}</span>
                <span className="pip"></span>
                <span>Started {PROGRAM.started}</span>
              </div>
            </div>
            <StepIndicator step="measure" />
          </div>

          <OutcomeBanner visible={bannerVisible} onDismiss={() => { setBannerVisible(false); setTweak("showBanner", false); }} />

          <MetricsBand />

          <LearnerTable />

          {tweaks.showTrust && (
            <div className="trust-strip evidence">
              <span className="item"><i className="fa-solid fa-shield-check"></i> Evidence retained for 7 years</span>
              <span className="sep"></span>
              <span className="item"><i className="fa-solid fa-circle-check"></i> Mastery verified against your rubric</span>
              <span className="sep"></span>
              <span className="item"><i className="fa-solid fa-circle-check"></i> SCORM 2004 & xAPI exports</span>
              <span className="sep"></span>
              <span className="item"><i className="fa-solid fa-circle-check"></i> Read-only access for stakeholders</span>
            </div>
          )}
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Demo state">
          <TweakToggle
            label="Show outcome banner"
            value={tweaks.showBanner}
            onChange={v => setTweak("showBanner", v)}
          />
          <TweakToggle
            label="Show trust strip"
            value={tweaks.showTrust}
            onChange={v => setTweak("showTrust", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<MeasureApp />);
