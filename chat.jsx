// chat.jsx — Program Designer agent panel

const CHAT_BUYER = window.BUYER;

const PT_LABEL = {
  "preskill": "Preskill",
  "upskill-int": "Upskill · Intermediate",
  "upskill-adv": "Upskill · Advanced",
  "reskill": "Reskill",
};

const formatBriefSummary = (b) => {
  const pt = PT_LABEL[b.programType] || "—";
  const len =
    b.length === "1-2" ? "1–2 wks" :
    b.length === "3-4" ? "3–4 wks" :
    b.length === "5-8" ? "5–8 wks" :
    b.length === "other" ? (b.lengthWeeks ? `${b.lengthWeeks} wks` : "Custom length") :
    "—";
  return { pt, len };
};

const BriefSummary = ({ brief, onEdit }) => {
  const { pt, len } = formatBriefSummary(brief);
  return (
    <div className="brief-summary">
      <span className="label">Brief</span>
      <div className="body">
        <strong>{brief.topic}</strong>
        <span className="pip"></span>
        {brief.audience.join(", ")}
        <span className="pip"></span>
        {pt}
        <span className="pip"></span>
        {len}
        <span className="pip"></span>
        {brief.learners} learners
        <span className="pip"></span>
        {brief.pace}
      </div>
      <button className="edit-btn" onClick={onEdit}>
        <i className="fa-regular fa-pen-to-square"></i> Edit
      </button>
    </div>
  );
};

const Trace = ({ items }) => (
  <div className="trace">
    <div className="trace-head">
      <i className="fa-solid fa-circle-info"></i>
      Grounded on
    </div>
    <ul>
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  </div>
);

const QuickReplies = ({ options, onPick }) => (
  <div className="quick-replies">
    {options.map(o => (
      <button key={o} onClick={() => onPick(o)}>{o}</button>
    ))}
  </div>
);

const Module = ({ m, idx, open, onToggle }) => (
  <div className={`module ${open ? "open" : ""}`}>
    <div className="module-head" onClick={onToggle}>
      <div className="module-num">{idx + 1}</div>
      <div className="module-info">
        <h5 className="title">{m.title}</h5>
        <p className="obj"><span className="obj-label">Objective</span>{m.objective}</p>
      </div>
      <div className="module-meta">
        <span className="pill">{m.duration}</span>
        <span>{m.lessons.length} lessons</span>
        <i className="fa-solid fa-chevron-down chev"></i>
      </div>
    </div>
    {open && (
      <div className="lessons">
        {m.lessons.map((l, i) => (
          <div key={i} className="lesson">
            <span className="les-num">{idx + 1}.{i + 1}</span>
            <span className="les-title">{l.title}</span>
            <span className={`les-kind ${l.kind}`}>{l.kind}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Proposal = ({ proposal }) => {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <div className="proposal">
      <div className="proposal-head">
        <div className="overline">Proposed program</div>
        <h4>{proposal.title}</h4>
        <div className="stats">
          <span><i className="fa-regular fa-layer-group"></i>{proposal.modules.length} modules</span>
          <span><i className="fa-regular fa-book-open"></i>{proposal.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons</span>
          <span><i className="fa-regular fa-clock"></i>{proposal.totalDuration}</span>
          <span><i className="fa-regular fa-gauge-simple"></i>{proposal.pace}</span>
        </div>
      </div>
      <div className="proposal-modules">
        {proposal.modules.map((m, idx) => (
          <Module key={idx} m={m} idx={idx} open={openIdx === idx} onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)} />
        ))}
      </div>
      <div className="proposal-foot">
        <span style={{ font: "500 12px var(--font-sans)", color: "var(--fg-secondary)" }}>
          <i className="fa-regular fa-shield-check" style={{ color: "var(--color-success-500)", marginRight: 6 }}></i>
          Mapped to your skills graph · 18 of 22 sub-skills covered
        </span>
        <div className="iter-actions">
          <button className="btn btn-secondary btn-sm">
            <i className="fa-regular fa-rotate"></i> Regenerate
          </button>
          <button className="btn btn-primary btn-sm">
            Accept & continue to Design
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const Message = ({ msg, showTrace }) => {
  if (msg.role === "user") {
    return (
      <div className="msg user">
        <span className="author-mark">{CHAT_BUYER.initials}</span>
        <div className="bubble">
          <div className="meta">You · just now</div>
          <div className="body">{msg.text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="msg agent">
      <span className="author-mark"><span></span></span>
      <div className="bubble">
        <div className="meta">Program Designer · {msg.timeLabel || "just now"}</div>
        <div className="body">
          {msg.text && msg.text.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {showTrace && msg.trace && <Trace items={msg.trace} />}
        {msg.proposal && <Proposal proposal={msg.proposal} />}
        {msg.quickReplies && msg.onQuickReply && (
          <QuickReplies options={msg.quickReplies} onPick={msg.onQuickReply} />
        )}
      </div>
    </div>
  );
};

const TypingBubble = () => (
  <div className="msg agent">
    <span className="author-mark"><span></span></span>
    <div className="bubble">
      <div className="meta">Program Designer · thinking…</div>
      <div className="typing"><span></span><span></span><span></span></div>
    </div>
  </div>
);

const Composer = ({ value, onChange, onSend, disabled }) => {
  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <div className="composer">
      <div className="input-wrap">
        <textarea
          placeholder="Reply to the Program Designer…"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          style={{ height: Math.min(160, Math.max(24, value.split("\n").length * 22)) }}
        />
        <button className="send-btn" onClick={onSend} disabled={disabled || !value.trim()}>
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
      <div className="helpers">
        <span><span className="kbd">Enter</span> to send · <span className="kbd">Shift+Enter</span> for newline</span>
        <span className="spacer"></span>
        <span className="grounding">
          <i className="fa-regular fa-shield-check" style={{ color: "var(--color-success-500)" }}></i>
          Grounded on your brief + skills graph
        </span>
      </div>
    </div>
  );
};

const ChatPanel = ({ brief, started, messages, draft, setDraft, sending, onSend, onEditBrief, tweaks }) => {
  const streamRef = React.useRef(null);
  React.useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [messages.length, sending]);

  return (
    <div className="chat">
      <div className="chat-head">
        <div className={`agent-avatar ${sending ? "thinking" : ""}`}>
          <span className="glyph">cs</span>
        </div>
        <div className="id">
          <div className="name">Program Designer</div>
          <div className="meta">
            <i className="fa-solid fa-circle"></i>
            Online · grounded on {CHAT_BUYER.company} skills graph + 142 reference programs
          </div>
        </div>
        <div className="head-actions">
          <button className="icon-btn" title="Open in pane"><i className="fa-regular fa-arrow-up-right-from-square"></i></button>
          <button className="icon-btn" title="More"><i className="fa-solid fa-ellipsis"></i></button>
        </div>
      </div>

      {started && <BriefSummary brief={brief} onEdit={onEditBrief} />}

      {!started ? (
        <div className="chat-empty">
          <div className="glyph"><i className="fa-regular fa-comments"></i></div>
          <h3>Brief the agent. <strong>It builds from there.</strong></h3>
          <p>
            Once you submit, the Program Designer will ask one or two clarifying
            questions, then propose a module-by-module structure for you to react to.
          </p>
        </div>
      ) : (
        <>
          <div className="chat-stream" ref={streamRef}>
            {messages.map((m, i) => <Message key={i} msg={m} showTrace={tweaks.showTrace} />)}
            {sending && <TypingBubble />}
          </div>
          <Composer
            value={draft}
            onChange={setDraft}
            onSend={onSend}
            disabled={sending}
          />
        </>
      )}
    </div>
  );
};

Object.assign(window, { ChatPanel });
