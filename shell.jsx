// shell.jsx — buyer-side app chrome

const BUYER = window.BUYER || { fullName: "Priya Ramesh", company: "Northbeam", role: "Head of L&D", initials: "PR", companyInitials: "NB", firstName: "Priya" };

const Sidebar = ({ activeNav = "active" }) => {
  const programs = [
    { id: "active", label: "Active programs", icon: "fa-regular fa-play", count: 4 },
    { id: "drafts", label: "Drafts", icon: "fa-regular fa-pen-ruler", count: 2 },
    { id: "templates", label: "Templates", icon: "fa-regular fa-file-lines" },
    { id: "library", label: "Skills library", icon: "fa-regular fa-shapes" },
  ];
  const insights = [
    { id: "learners", label: "Learners", icon: "fa-regular fa-users" },
    { id: "outcomes", label: "Outcomes", icon: "fa-regular fa-chart-line" },
    { id: "evidence", label: "Evidence locker", icon: "fa-regular fa-shield-check" },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">cs</span>
        <span className="brand-name">
          Chegg Skills
          <small>Agentic Skilling</small>
        </span>
      </div>

      <div className="ws-switcher">
        <span className="ws-mark">{BUYER.companyInitials}</span>
        <span className="ws-info">
          <span>{BUYER.company}</span>
          <span>L&D workspace</span>
        </span>
        <i className="fa-solid fa-chevron-down"></i>
      </div>

      <a className="nav-item nav-new">
        <span className="ico"><i className="fa-solid fa-plus"></i></span>
        New program
      </a>

      <div>
        <div className="nav-label">Programs</div>
        {programs.map((it) => (
          <a key={it.id} className={`nav-item ${activeNav === it.id ? "active" : ""}`}>
            <span className="ico"><i className={it.icon}></i></span>
            {it.label}
            {it.count != null && <span className="count">{it.count}</span>}
          </a>
        ))}
      </div>

      <div>
        <div className="nav-label">Insights</div>
        {insights.map(it => (
          <a key={it.id} className={`nav-item ${activeNav === it.id ? "active" : ""}`}>
            <span className="ico"><i className={it.icon}></i></span>
            {it.label}
          </a>
        ))}
      </div>

      <div className="sidebar-footer">
        <span className="avatar">{BUYER.initials}</span>
        <span className="info">
          {BUYER.fullName}
          <small>{BUYER.role}</small>
        </span>
        <i className="fa-regular fa-gear"></i>
      </div>
    </aside>
  );
};

const TopBar = ({ crumbs, status, statusTone = "warning", saveAction = "Save draft", saveIcon = "fa-regular fa-floppy-disk" }) => {
  const defaultCrumbs = [
    { label: "Programs", href: "#" },
    { label: "Drafts", href: "#" },
    { label: "Untitled program", current: true },
  ];
  const items = crumbs || defaultCrumbs;
  const statusText = status || "Draft · auto-saved 12s ago";
  const dotColor = statusTone === "success" ? "var(--color-success-500)" : statusTone === "info" ? "var(--color-info-500)" : "var(--color-warning-500)";
  return (
    <header className="topbar">
      <div className="crumbs">
        {items.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep"><i className="fa-solid fa-chevron-right"></i></span>}
            {c.current
              ? <span className="current">{c.label}</span>
              : c.href
                ? <a href={c.href}>{c.label}</a>
                : <a>{c.label}</a>}
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-status">
        <span className="status-pill">
          <span className="dot" style={{ background: dotColor }}></span>
          {statusText}
        </span>
        <button className="icon-btn" title="Share"><i className="fa-regular fa-share-nodes"></i></button>
        <button className="icon-btn" title="History"><i className="fa-regular fa-clock-rotate-left"></i></button>
        <button className="btn btn-secondary btn-sm">
          <i className={saveIcon}></i>
          {saveAction}
        </button>
      </div>
    </header>
  );
};

const StepIndicator = ({ step, links = { define: "Define.html", measure: "Measure.html" } }) => {
  const items = [
    { id: "define", label: "Define" },
    { id: "design", label: "Design" },
    { id: "deploy", label: "Deploy" },
    { id: "measure", label: "Measure" },
  ];
  const currentIdx = items.findIndex(x => x.id === step);
  return (
    <div className="steps">
      {items.map((it, idx) => {
        const status = step === it.id ? "active" : idx < currentIdx ? "done" : "";
        const href = links[it.id];
        const content = (
          <>
            <span className="num">
              {idx < currentIdx ? <i className="fa-solid fa-check" style={{fontSize: 8}}></i> : idx + 1}
            </span>
            {it.label}
          </>
        );
        return (
          <React.Fragment key={it.id}>
            {href
              ? <a className={`step ${status}`} href={href}>{content}</a>
              : <span className={`step ${status}`}>{content}</span>}
            {idx < items.length - 1 && <span className="arrow"><i className="fa-solid fa-chevron-right"></i></span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Object.assign(window, { Sidebar, TopBar, StepIndicator });
