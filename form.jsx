// form.jsx — Brief form for the buyer

const ChipInput = ({ value = [], onChange, placeholder, chipVariant }) => {
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef(null);
  const commit = (v) => {
    const t = (v || draft).trim().replace(/,$/, "").trim();
    if (!t) return;
    if (value.some(c => c.toLowerCase() === t.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  };
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className="ctl chip-input" onClick={() => inputRef.current?.focus()}>
      {value.map(c => (
        <span key={c} className={`chip ${chipVariant || ""}`}>
          {c}
          <button onClick={(e) => { e.stopPropagation(); onChange(value.filter(x => x !== c)); }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => commit()}
        placeholder={value.length ? "" : placeholder}
      />
    </div>
  );
};

const Segmented = ({ value, onChange, options }) => (
  <div className="segmented">
    {options.map(o => (
      <button
        key={o.value}
        className={value === o.value ? "active" : ""}
        onClick={() => onChange(o.value)}
        type="button"
      >
        {o.label}
      </button>
    ))}
  </div>
);

const NumberInput = ({ value, onChange, min = 1, max = 9999, step = 1, suffix }) => {
  const clamp = (n) => Math.max(min, Math.min(max, n));
  return (
    <div className="num-input">
      <button className="step-btn" type="button" onClick={() => onChange(clamp((Number(value) || 0) - step))}>
        <i className="fa-solid fa-minus"></i>
      </button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value === "" ? "" : clamp(Number(e.target.value)))}
        min={min}
        max={max}
      />
      <button className="step-btn" type="button" onClick={() => onChange(clamp((Number(value) || 0) + step))}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
};

const Select = ({ value, onChange, children }) => (
  <div className="select-wrap">
    <select value={value} onChange={e => onChange(e.target.value)}>{children}</select>
  </div>
);

// Rich dropdown — option labels carry inline help text
const RichDropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <>
      {open && <div className="rich-dd-backdrop" onClick={() => setOpen(false)}></div>}
      <div className={`rich-dd ${open ? "open" : ""}`}>
        <button type="button" className="trigger" onClick={() => setOpen(o => !o)}>
          {selected ? (
            <>
              {selected.tier && <span className="tag">{selected.tier}</span>}
              <span className="selected-label">
                {selected.label}
                {selected.help && <span className="selected-help"> — {selected.help.split(".")[0]}.</span>}
              </span>
            </>
          ) : (
            <span className="placeholder selected-label">{placeholder}</span>
          )}
          <i className="fa-solid fa-chevron-down chev"></i>
        </button>
        {open && (
          <div className="menu" role="listbox">
            {options.map(o => (
              <button
                key={o.value}
                type="button"
                className={`opt ${o.value === value ? "active" : ""}`}
                onClick={() => { onChange(o.value); setOpen(false); }}
                role="option"
                aria-selected={o.value === value}
              >
                <span className="ic"><i className={o.icon}></i></span>
                <div>
                  <div className="label">
                    {o.label}
                    {o.tier && <span className="tier">{o.tier}</span>}
                  </div>
                  <div className="help">{o.help}</div>
                </div>
                <i className="fa-solid fa-check check"></i>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// Suggestion pill row (shown below a field)
const Suggestions = ({ items, onPick }) => (
  <div className="suggest-row">
    {items.map(it => (
      <button key={it} className="sug" onClick={() => onPick(it)} type="button">
        <i className="fa-solid fa-plus" style={{ fontSize: 9 }}></i>
        {it}
      </button>
    ))}
  </div>
);

const BriefForm = ({ brief, setBrief, onSubmit, completeness, tweaks }) => {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const set = (k, v) => setBrief({ ...brief, [k]: v });

  const programTypeOptions = [
    {
      value: "preskill",
      label: "Preskill",
      icon: "fa-regular fa-seedling",
      help: "Building entirely new skills to prepare learners for future responsibilities or roles they haven't encountered yet.",
    },
    {
      value: "upskill-int",
      label: "Upskill",
      tier: "Intermediate",
      icon: "fa-regular fa-arrow-trend-up",
      help: "Strengthening current skills and filling knowledge gaps so learners can apply what they know more effectively in everyday work.",
    },
    {
      value: "upskill-adv",
      label: "Upskill",
      tier: "Advanced",
      icon: "fa-regular fa-chess-knight",
      help: "Deepening expertise to handle complex problems, optimize workflows, and apply advanced techniques with confidence.",
    },
    {
      value: "reskill",
      label: "Reskill",
      icon: "fa-regular fa-shuffle",
      help: "Teaching different skills to enable transitions to new roles or responsibilities.",
    },
  ];

  const audienceSuggest = ["Data analysts", "Product managers", "Sales engineers", "Customer success"].filter(s => !brief.audience.includes(s));
  const subSkillSuggest = ["Cohort analysis", "Funnel design", "Activation metrics", "SQL"].filter(s => !brief.subSkills.includes(s));
  const toolSuggest = ["Snowflake", "Amplitude", "dbt", "Looker", "Mode", "Hex"].filter(s => !brief.tools.includes(s));

  const moreCount = [brief.desiredOutcome, brief.subSkills.length, brief.tools.length, brief.pace !== "2-3 hrs/week"].filter(Boolean).length;
  const ready = completeness === 100;

  return (
    <div className={`brief ${tweaks.density === "compact" ? "density-compact" : ""}`}>
      <div className="brief-head">
        <div>
          <h2>Program brief</h2>
          <div className="helper">A few essentials so the Program Designer can draft a structure you can react to.</div>
        </div>
        <div className="meta">
          <i className="fa-regular fa-clock"></i>
          ~2 min
          <span className="dot"></span>
          <i className="fa-regular fa-lock"></i>
          Org-only
        </div>
      </div>

      <div className="brief-body">
        <div className="field-grid">
          <div className="field full">
            <label>Topic <span className="req">*</span></label>
            <input
              className="ctl"
              value={brief.topic}
              onChange={e => set("topic", e.target.value)}
              placeholder="e.g. Product analytics for PMs"
            />
          </div>

          <div className="field full">
            <label>
              Audience / Role(s) <span className="req">*</span>
              <span className="opt">Press enter to add</span>
            </label>
            <ChipInput
              value={brief.audience}
              onChange={v => set("audience", v)}
              placeholder="Add a role…"
              chipVariant="accent"
            />
            {audienceSuggest.length > 0 && (
              <Suggestions items={audienceSuggest.slice(0, 3)} onPick={s => set("audience", [...brief.audience, s])} />
            )}
          </div>

          <div className="field full">
            <label>Program type <span className="req">*</span></label>
            <RichDropdown
              value={brief.programType}
              onChange={v => set("programType", v)}
              options={programTypeOptions}
              placeholder="Select a program type…"
            />
          </div>

          <div className="field full">
            <label>Core learning objective or problem to solve <span className="req">*</span></label>
            <textarea
              className="ctl"
              value={brief.objective}
              onChange={e => set("objective", e.target.value)}
              placeholder="What should learners be able to do, or what business problem are you solving?"
            />
            <div className="hint">One or two sentences. The agent uses this to ground every module.</div>
          </div>

          <div className="field">
            <label>Length <span className="req">*</span></label>
            <Select value={brief.length} onChange={v => set("length", v)}>
              <option value="">Select length…</option>
              <option value="1-2">1–2 weeks</option>
              <option value="3-4">3–4 weeks</option>
              <option value="5-8">5–8 weeks</option>
              <option value="other">Other (I'll specify)</option>
            </Select>
          </div>

          <div className="field">
            <label>Number of learners <span className="req">*</span></label>
            <NumberInput
              value={brief.learners}
              onChange={v => set("learners", v)}
              min={1}
              max={5000}
            />
          </div>
        </div>
      </div>

      <div className="more-context">
        <button className={`more-toggle ${moreOpen ? "open" : ""}`} onClick={() => setMoreOpen(o => !o)} type="button">
          <i className="fa-regular fa-sliders"></i>
          More context
          <span className={`badge ${moreCount > 0 ? "has" : ""}`}>{moreCount > 0 ? `${moreCount} added` : "Optional"}</span>
          <i className="fa-solid fa-chevron-down chev"></i>
        </button>
        {moreOpen && (
          <div className="more-panel">
            <div className="field">
              <label>Desired outcome <span className="opt">Optional</span></label>
              <input
                className="ctl"
                value={brief.desiredOutcome}
                onChange={e => set("desiredOutcome", e.target.value)}
                placeholder="e.g. Each PM ships one analytics-backed proposal this quarter"
              />
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Sub-skills <span className="opt">Add as chips</span></label>
                <ChipInput
                  value={brief.subSkills}
                  onChange={v => set("subSkills", v)}
                  placeholder="e.g. Cohort analysis"
                />
                {subSkillSuggest.length > 0 && (
                  <Suggestions items={subSkillSuggest.slice(0, 3)} onPick={s => set("subSkills", [...brief.subSkills, s])} />
                )}
              </div>
              <div className="field">
                <label>Tools <span className="opt">Add as chips</span></label>
                <ChipInput
                  value={brief.tools}
                  onChange={v => set("tools", v)}
                  placeholder="e.g. Snowflake, Amplitude"
                  chipVariant="tool"
                />
                {toolSuggest.length > 0 && (
                  <Suggestions items={toolSuggest.slice(0, 4)} onPick={s => set("tools", [...brief.tools, s])} />
                )}
              </div>
            </div>
            <div className="field" style={{ maxWidth: 280 }}>
              <label>Pace <span className="opt">Default 2–3 hrs/week</span></label>
              <Select value={brief.pace} onChange={v => set("pace", v)}>
                <option>1–2 hrs/week</option>
                <option>2–3 hrs/week</option>
                <option>3–5 hrs/week</option>
                <option>5+ hrs/week (immersive)</option>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="action-bar">
        <div className={`completeness ${completeness < 100 ? "partial" : ""}`}>
          <div className="bar"><span style={{ width: `${completeness}%` }}></span></div>
          {completeness < 100 ? `Brief ${completeness}% complete` : "Brief complete"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost btn-sm" type="button">
            <i className="fa-regular fa-file-lines"></i>
            Start from template
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={onSubmit}
            disabled={!ready}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            Design my program
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BriefForm });
