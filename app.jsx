// app.jsx — root of the Define screen prototype

const BUYER = window.BUYER;

const SAMPLE_BRIEF = {
  topic: "Product analytics for product managers",
  audience: ["Product managers", "Senior PMs"],
  programType: "upskill-int",
  objective: "Help PMs ground every roadmap decision in evidence: pick the right metric, instrument it well, and read the data without phoning a friend on the data team.",
  length: "3-4",
  learners: 38,
  desiredOutcome: "Each PM ships one analytics-backed proposal this quarter",
  subSkills: ["Cohort analysis", "Funnel design", "Activation metrics"],
  tools: ["Snowflake", "Amplitude"],
  pace: "2–3 hrs/week",
};

const EMPTY_BRIEF = {
  topic: "",
  audience: [],
  programType: "",
  objective: "",
  length: "",
  learners: "",
  desiredOutcome: "",
  subSkills: [],
  tools: [],
  pace: "2–3 hrs/week",
};

const requiredCompleteness = (b) => {
  const required = [
    b.topic.trim().length > 0,
    b.audience.length > 0,
    !!b.programType,
    b.objective.trim().length > 0,
    !!b.length,
    Number(b.learners) > 0,
  ];
  const done = required.filter(Boolean).length;
  return Math.round((done / required.length) * 100);
};

// Build a program proposal that adapts to the brief
const buildProposal = (b) => {
  const pt = PROGRAM_TYPE_META[b.programType] || PROGRAM_TYPE_META["upskill-int"];
  const nMod = b.length === "1-2" ? 2 : b.length === "3-4" ? 4 : b.length === "5-8" ? 6 : (b.lengthWeeks || 4);
  const totalDuration =
    b.length === "1-2" ? "2 weeks" :
    b.length === "3-4" ? "4 weeks" :
    b.length === "5-8" ? "6 weeks" :
    (b.lengthWeeks ? `${b.lengthWeeks} weeks` : "4 weeks");
  const toolsList = b.tools.length ? b.tools.join(", ") : "your team's analytics stack";

  const fullCatalog = [
    {
      title: "Frame the metric that matters",
      objective: "Translate a product strategy into one north-star metric and 2–3 supporting inputs you can actually move.",
      duration: "Week 1",
      lessons: [
        { title: "From product strategy to north-star metric", kind: "learn" },
        { title: `Hands-on: pick a north-star for your surface`, kind: "project" },
        { title: "Peer review: defend your metric choice", kind: "live" },
      ],
    },
    {
      title: "Instrumentation you can trust",
      objective: `Audit and design event tracking in ${toolsList} so the numbers you ship from are the numbers you trust.`,
      duration: "Week 2",
      lessons: [
        { title: "Event taxonomy & naming conventions", kind: "learn" },
        { title: `Hands-on: audit a tracking plan in ${b.tools[1] || "Amplitude"}`, kind: "project" },
        { title: "When numbers disagree: a debugging playbook", kind: "learn" },
        { title: "Knowledge check: instrumentation review", kind: "assess" },
      ],
    },
    {
      title: "Read the data, fast",
      objective: "Move confidently through funnels, cohorts, and retention without waiting on the data team.",
      duration: "Week 3",
      lessons: [
        { title: "Funnels, cohorts, and retention — the right tool for the question", kind: "learn" },
        { title: `Practice: 8 SQL prompts in ${b.tools[0] || "Snowflake"}`, kind: "project" },
        { title: "Project: write a weekly insight memo", kind: "project" },
      ],
    },
    {
      title: "Decide and ship",
      objective: "Turn an insight into a hypothesis, a test, and a proposal that lands with leadership.",
      duration: "Week 4",
      lessons: [
        { title: "From insight to A/B test (and when not to)", kind: "learn" },
        { title: "Live workshop: pitch a hypothesis to peers", kind: "live" },
        { title: "Capstone: a 1-page analytics-backed proposal", kind: "project" },
        { title: "Capstone review with rubric", kind: "assess" },
      ],
    },
    {
      title: "Working with the data team",
      objective: "Build a high-trust relationship with data partners — scope requests, share context, close the loop.",
      duration: "Week 5",
      lessons: [
        { title: "Anatomy of a great data request", kind: "learn" },
        { title: "Role-play: scope a half-baked ask in 15 minutes", kind: "live" },
        { title: "Project: rewrite three real requests from your team", kind: "project" },
      ],
    },
    {
      title: "Practice in your own product",
      objective: `Apply everything to a real surface in ${BUYER.company} — observe, instrument, decide.`,
      duration: "Week 6",
      lessons: [
        { title: "Site visit: a real PM's analytics workflow", kind: "live" },
        { title: "Capstone, part one: pick a surface and instrument it", kind: "project" },
        { title: "Capstone, part two: write the proposal", kind: "project" },
        { title: "Final review with your L&D lead", kind: "live" },
      ],
    },
  ];

  // For 1-2 weeks, compress into 2 modules
  let modules;
  if (nMod === 2) {
    modules = [
      { ...fullCatalog[0], duration: "Week 1" },
      { ...fullCatalog[3], duration: "Week 2", title: "Read, decide, ship" },
    ];
  } else {
    modules = fullCatalog.slice(0, nMod);
  }

  return {
    title: `${b.topic.charAt(0).toUpperCase() + b.topic.slice(1)} · ${pt.label} cohort`,
    totalDuration,
    pace: b.pace,
    modules,
    skippedFoundations: !!b.skippedFoundations,
  };
};

// Program-type metadata used by the agent
const PROGRAM_TYPE_META = {
  "preskill":      { label: "Preskill",              tone: "net-new",   asksExisting: false },
  "upskill-int":   { label: "Upskill (Intermediate)", tone: "sharpen",  asksExisting: true  },
  "upskill-adv":   { label: "Upskill (Advanced)",     tone: "deepen",   asksExisting: true  },
  "reskill":       { label: "Reskill",                tone: "transition", asksExisting: true },
};

// Conversation scripting
const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "showTrace": true,
  "prefillSample": true,
  "agentTone": "coach"
}/*EDITMODE-END*/;

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULS);
  const [brief, setBrief] = React.useState(EMPTY_BRIEF);
  const [started, setStarted] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const chatRef = React.useRef(null);
  const briefRef = React.useRef(null);

  // Apply sample-prefill tweak
  const lastPrefill = React.useRef(false);
  React.useEffect(() => {
    if (tweaks.prefillSample && !lastPrefill.current) {
      setBrief(SAMPLE_BRIEF);
      // Pre-play the conversation: clarifier → sample user reply → proposal
      const initial = buildInitialConversation(SAMPLE_BRIEF);
      const userReply = { role: "user", text: "Comfortable with SQL basics & Amplitude funnels. Most can read a dashboard but can't build their own. Honestly weakest on metric design — they pick vanity metrics under pressure." };
      const followUp = nextAgentResponse(SAMPLE_BRIEF, [...initial, userReply]);
      setMessages([...initial, userReply, ...followUp]);
      setStarted(true);
      lastPrefill.current = true;
    } else if (!tweaks.prefillSample && lastPrefill.current) {
      setBrief(EMPTY_BRIEF);
      lastPrefill.current = false;
      setStarted(false);
      setMessages([]);
    }
  }, [tweaks.prefillSample]);

  const completeness = requiredCompleteness(brief);

  const onSubmit = () => {
    if (completeness < 100) return;
    setStarted(true);
    // Initial agent message
    const firstMessages = buildInitialConversation(brief);
    setMessages([]);
    // Stream them in
    setSending(true);
    setTimeout(() => {
      setMessages([firstMessages[0]]);
      setSending(false);
    }, 700);
    // Scroll to chat
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const onEditBrief = () => {
    briefRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sendUserMessage = (text) => {
    if (!text.trim() || sending) return;
    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setDraft("");
    setSending(true);

    // Compose the agent's next response based on conversation state
    setTimeout(() => {
      const agentMsgs = nextAgentResponse(brief, messages.concat(userMsg));
      setMessages(prev => [...prev, ...agentMsgs]);
      setSending(false);
    }, 1200);
  };

  const onQuickReply = (text) => sendUserMessage(text);

  // Inject the onQuickReply into the last message if it has quickReplies
  const decoratedMessages = messages.map((m, i) => {
    if (m.role === "agent" && m.quickReplies && i === messages.length - 1 && !sending) {
      return { ...m, onQuickReply };
    }
    return m;
  });

  return (
    <div className="app">
      <Sidebar />
      <TopBar />
      <main className="main">
        <div className="page">
          <div className="page-head">
            <div>
              <div className="overline">New program · Step 1 of 4</div>
              <h1>
                {BUYER.firstName !== "there" ? `${BUYER.firstName}, define what you want — ` : "Define what you want — "}
                <strong>we'll design how.</strong>
              </h1>
              <p className="sub">
                Brief the Program Designer in plain language. It drafts a structure in under a minute, then <strong>you shape it together</strong>.
              </p>
            </div>
            <StepIndicator step="define" />
          </div>

          <div ref={briefRef}>
            <BriefForm
              brief={brief}
              setBrief={setBrief}
              onSubmit={onSubmit}
              completeness={completeness}
              tweaks={tweaks}
            />
          </div>

          <div className="trust-strip">
            <span className="item"><i className="fa-solid fa-shield-check"></i> SOC 2 · org-only data</span>
            <span className="sep"></span>
            <span className="item"><i className="fa-solid fa-circle-check"></i> Mapped to your skills graph</span>
            <span className="sep"></span>
            <span className="item"><i className="fa-solid fa-circle-check"></i> SCORM 2004 & xAPI export</span>
            <span className="sep"></span>
            <span className="item"><i className="fa-solid fa-circle-check"></i> Reviewed against your L&D rubric</span>
          </div>

          <div ref={chatRef}>
            <ChatPanel
              brief={brief}
              started={started}
              messages={decoratedMessages}
              draft={draft}
              setDraft={setDraft}
              sending={sending}
              onSend={() => sendUserMessage(draft)}
              onEditBrief={onEditBrief}
              tweaks={tweaks}
            />
          </div>
        </div>
      </main>

      <TweaksPanelWrapper tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
};

// ----- Conversation builders -----

// Decide which clarifiers the agent needs to ask, in order.
// Priority: length specifics (if Other) → existing skills (if upskill/reskill)
// → tools (if missing and not already covered).
const plannedClarifiers = (b) => {
  const out = [];
  if (b.length === "other") out.push("length");
  if (PROGRAM_TYPE_META[b.programType]?.asksExisting) out.push("existing");
  if (!b.tools.length && b.programType === "preskill") out.push("tools");
  return out;
};

const buildInitialConversation = (brief) => {
  const pt = PROGRAM_TYPE_META[brief.programType] || PROGRAM_TYPE_META["upskill-int"];
  const audienceLabel = brief.audience.slice(0, 2).join(" and ") + (brief.audience.length > 2 ? ` (+${brief.audience.length - 2})` : "");
  const weeksLabel =
    brief.length === "1-2" ? "2-week" :
    brief.length === "3-4" ? "4-week" :
    brief.length === "5-8" ? "6-week" :
    "";
  const lengthClause = weeksLabel ? `${weeksLabel} ` : "";
  const ptClause = pt.label;

  const baseTrace = [
    `${BUYER.company} skills graph — ${brief.audience.join(" / ") || "audience"} role profile`,
    `${brief.learners} learners · ${brief.pace} pace`,
    `Anchored on: "${brief.objective.length > 80 ? brief.objective.slice(0, 80) + "…" : brief.objective}"`,
  ];

  const clarifiers = plannedClarifiers(brief);
  if (clarifiers.length === 0) {
    // Skip straight to proposal
    const proposal = buildProposal(brief);
    return [{
      role: "agent",
      text:
        `Got it. Here's a first cut for the ${lengthClause}${ptClause} cohort on "${brief.topic}."\n\n` +
        `Open any module to see the lessons. Tell me what to change — I can resize a module, swap a lesson for a project, or shift the difficulty curve.`,
      trace: [...baseTrace, `Drafted ${proposal.modules.length} modules, ${proposal.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons`],
      proposal,
      quickReplies: ["Make module 2 longer", "Replace the live session with async", "Looks great — continue"],
      timeLabel: "just now",
    }];
  }

  const first = clarifiers[0];
  if (first === "length") {
    return [{
      role: "agent",
      text:
        `Got it — a ${ptClause} program for ${audienceLabel} on "${brief.topic}."\n\n` +
        `You picked Other for length, so before I draft a structure: what are you targeting? Even rough numbers help — total weeks, hours per learner per week, and any hard constraints (a launch date, an executive review, a quarterly OKR).`,
      trace: baseTrace,
      quickReplies: [
        "~6 weeks, 3 hrs/week, must wrap by July 31",
        "2 weeks intensive, 6 hrs/week",
        "Open — propose what's optimal",
      ],
      timeLabel: "just now",
    }];
  }

  if (first === "existing") {
    const verb =
      brief.programType === "reskill" ? "transition into this from" :
      brief.programType === "upskill-adv" ? "already operate at" :
      "already know";
    return [{
      role: "agent",
      text:
        `Got it — a ${lengthClause}${ptClause} program for ${audienceLabel} on "${brief.topic}."\n\n` +
        `Since this is ${pt.label.toLowerCase()}, I want to skip foundations your team doesn't need. What does this audience ${verb}? A quick sketch is fine — I'll cross-check against the role profile in your skills graph.`,
      trace: [...baseTrace, `Skill graph has ${brief.audience.length ? "42 mapped competencies" : "a role profile"} for ${brief.audience[0] || "this audience"}`],
      quickReplies: [
        "Comfortable with SQL basics & Amplitude funnels",
        "Can read dashboards, can't build them",
        "Mixed — you decide what to skip",
      ],
      timeLabel: "just now",
    }];
  }

  // tools clarifier (preskill only path)
  return [{
    role: "agent",
    text:
      `Got it — a ${lengthClause}${ptClause} program for ${audienceLabel} on "${brief.topic}."\n\n` +
      `One quick clarifier: which tools should learners practice in? I'd like to weave hands-on lessons around your real stack rather than generic examples.`,
    trace: baseTrace,
    quickReplies: ["Snowflake + Amplitude", "Looker + dbt", "Skip — propose without tools"],
    timeLabel: "just now",
  }];
};

// Build a single clarifier agent message (the 2nd-onward ones)
const buildClarifier = (brief, kind) => {
  if (kind === "length") {
    return {
      role: "agent",
      text:
        `Before I draft a structure, one more thing on length: what are you targeting? Even rough numbers help — total weeks, hours per learner per week, and any hard constraints (a launch date, an executive review, a quarterly OKR).`,
      quickReplies: [
        "~6 weeks, 3 hrs/week, must wrap by July 31",
        "2 weeks intensive, 6 hrs/week",
        "Open — propose what's optimal",
      ],
      timeLabel: "just now",
    };
  }
  if (kind === "existing") {
    const pt = PROGRAM_TYPE_META[brief.programType] || PROGRAM_TYPE_META["upskill-int"];
    return {
      role: "agent",
      text:
        `Since this is ${pt.label.toLowerCase()}, I want to skip foundations your team doesn't need. What does this audience already know? A quick sketch is fine — I'll cross-check against your skills graph.`,
      quickReplies: [
        "Comfortable with SQL basics & Amplitude funnels",
        "Can read dashboards, can't build them",
        "Mixed — you decide what to skip",
      ],
      timeLabel: "just now",
    };
  }
  return {
    role: "agent",
    text: `Which tools should learners practice in?`,
    quickReplies: ["Snowflake + Amplitude", "Skip"],
    timeLabel: "just now",
  };
};

const nextAgentResponse = (brief, allMessages) => {
  const agentTurns = allMessages.filter(m => m.role === "agent").length;
  const lastUser = allMessages.filter(m => m.role === "user").slice(-1)[0];
  const t = (lastUser?.text || "").toLowerCase();

  const clarifiers = plannedClarifiers(brief);

  // Capture any tools mentioned in replies
  let effectiveBrief = brief;
  if (brief.tools.length === 0) {
    const inferred = [];
    if (t.includes("snowflake")) inferred.push("Snowflake");
    if (t.includes("amplitude")) inferred.push("Amplitude");
    if (t.includes("looker")) inferred.push("Looker");
    if (t.includes("dbt")) inferred.push("dbt");
    if (t.includes("mode")) inferred.push("Mode");
    if (t.includes("hex")) inferred.push("Hex");
    if (t.includes("figma")) inferred.push("Figma");
    if (inferred.length) effectiveBrief = { ...brief, tools: inferred };
  }
  // Capture skip-foundations signal
  if (clarifiers.includes("existing") && agentTurns === clarifiers.indexOf("existing") + 1) {
    effectiveBrief = { ...effectiveBrief, skippedFoundations: true };
  }
  // Capture length specifics
  if (clarifiers.includes("length") && agentTurns === clarifiers.indexOf("length") + 1) {
    const m = (lastUser?.text || "").match(/(\d+)\s*week/i);
    if (m) effectiveBrief = { ...effectiveBrief, lengthWeeks: Number(m[1]) };
  }

  // More clarifiers left?
  if (agentTurns < clarifiers.length) {
    return [buildClarifier(effectiveBrief, clarifiers[agentTurns])];
  }

  // First proposal
  if (agentTurns === clarifiers.length) {
    const proposal = buildProposal(effectiveBrief);
    const skipNote = effectiveBrief.skippedFoundations
      ? `I've trimmed foundational coverage based on what you said — starting from "instrumentation you can trust" rather than basics. `
      : "";
    return [{
      role: "agent",
      text:
        `Helpful — thanks. ${skipNote}Here's a first cut. I built it to peak at week ${proposal.modules.length} with a capstone you can share with leadership. Each lesson is 30–60 minutes; live sessions are 45 minutes.\n\n` +
        `Open any module to see the lessons. Tell me what to change — I can resize a module, swap a lesson for a project, or shift the difficulty curve.`,
      trace: [
        `${proposal.modules.length} modules · ${proposal.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons`,
        effectiveBrief.skippedFoundations ? `Foundational module skipped per your signal — added a 10-min self-check instead` : `Coverage: 18 of 22 sub-skills from the role profile`,
        `Capstone weighted at 35% per your evaluation cue`,
        `Tools woven into modules 2–3: ${effectiveBrief.tools.join(", ") || "generic"}`,
      ],
      proposal,
      quickReplies: [
        "Add a Snowflake project in module 3",
        "Make module 2 longer",
        "Replace the live session with async",
        "Looks great — continue",
      ],
      timeLabel: "just now",
    }];
  }

  // Iteration after proposal
  if (t.includes("continue") || t.includes("looks great") || t.includes("accept")) {
    return [{
      role: "agent",
      text:
        `Locking this in. I'll carry every choice into the Design step where you can edit lesson content, set rubrics, and pick reviewers. You can always come back here to ask for structural changes.`,
      quickReplies: ["Continue to Design"],
      timeLabel: "just now",
    }];
  }
  if (t.includes("longer") || t.includes("add")) {
    return [{
      role: "agent",
      text:
        `Done — I've expanded that section and rebalanced the pacing so total length stays the same. Want me to add a peer review checkpoint at the end of the new content, or keep it flowing into the capstone?`,
      quickReplies: ["Add a peer review", "Keep flowing into capstone"],
      timeLabel: "just now",
    }];
  }
  if (t.includes("shorter") || t.includes("remove") || t.includes("drop")) {
    return [{
      role: "agent",
      text:
        `Trimmed. I moved the cut material into an optional "go deeper" resource list inside the module so learners who want it can still find it. Want me to surface that list to managers as a sign-off option?`,
      quickReplies: ["Yes, surface it", "No, keep it learner-only"],
      timeLabel: "just now",
    }];
  }
  return [{
    role: "agent",
    text:
      `Got it. I'll fold that into the next version. Want me to update the proposal above in place, or show both side-by-side so you can compare?`,
    quickReplies: ["Update in place", "Compare side-by-side"],
    timeLabel: "just now",
  }];
};

// ----- Tweaks panel wrapper -----
const TweaksPanelWrapper = ({ tweaks, setTweak }) => (
  <TweaksPanel>
    <TweakSection label="Form">
      <TweakRadio
        label="Density"
        value={tweaks.density}
        onChange={v => setTweak("density", v)}
        options={[
          { value: "comfortable", label: "Roomy" },
          { value: "compact", label: "Compact" },
        ]}
      />
      <TweakToggle
        label="Pre-fill sample brief"
        value={tweaks.prefillSample}
        onChange={v => setTweak("prefillSample", v)}
      />
    </TweakSection>
    <TweakSection label="Agent">
      <TweakToggle
        label="Show grounding trace"
        value={tweaks.showTrace}
        onChange={v => setTweak("showTrace", v)}
      />
    </TweakSection>
  </TweaksPanel>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
