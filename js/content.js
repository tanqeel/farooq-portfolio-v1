/* ============================================================================
   FAROOQ — PORTFOLIO CONTENT · v1.0 (prototype)
   ----------------------------------------------------------------------------
   ⚠  ALL CONTENT IN THIS FILE IS PLACEHOLDER / DEMO DATA.
      It was AI-generated for the initial prototype so the full experience
      can be designed and reviewed end-to-end.

   WHEN FAROOQ PROVIDES REAL INFORMATION, REPLACE:
     · profile.role / tagline / location / email / bio        (ABOUT)
     · projects[]          — swap each concept with a real project
     · capabilities[]      — real service list
     · stack[]             — real technologies + proficiency notes
     · experiments[]       — real creative work
     · process[]           — real workflow (steps are generic-safe already)
     · socials[]           — real URLs (currently "#" placeholders)
     · assets/img/about-portrait.webp — real portrait photo

   HONESTY RULES (do not break these when editing):
     · Projects render with a "CONCEPT" chip — they are design prototypes,
       NOT real client work. Never present them as factual case studies.
     · Do not invent companies, employers, clients, awards, degrees or
       measurable achievements. The ABOUT copy below deliberately makes
       no employment / education claims.
   ============================================================================ */

window.CONTENT = {

  /* ---------------- Profile (EDITABLE) ---------------- */
  profile: {
    name: "Farooq",
    role: "Technology Specialist",                       // EDITABLE
    tagline: "Technology. Innovation. Digital Experiences.", // EDITABLE
    location: "Available worldwide · Remote-first",      // EDITABLE
    email: "hello@farooq.tech",                          // EDITABLE
    monogram: "F"
  },

  /* ---------------- Hero ---------------- */
  hero: {
    eyebrow: "Farooq · Technology Specialist",           // EDITABLE
    line1: "I engineer",
    line2: "digital experiences.",   // rendered in lavender→rose gradient
    sub: "Web platforms, intelligent systems and interactive products — designed and built with modern technology, from first idea to final launch.",
    primaryCta: { label: "Start a project", href: "#contact" },
    secondaryCta: { label: "See selected work", href: "#work" },
    statusPrefix: "VISION → TECHNOLOGY",
    chapters: [
      { n: "01", label: "Code",         img: "assets/img/hero-code.webp",         alt: "Macro of glowing code on a dark screen" },
      { n: "02", label: "Systems",      img: "assets/img/hero-systems.webp",      alt: "Dark data center corridor at night" },
      { n: "03", label: "Intelligence", img: "assets/img/hero-intelligence.webp", alt: "Abstract neural network in dark space" },
      { n: "04", label: "Future",       img: "assets/img/hero-future.webp",       alt: "Futuristic horizon with light trails" }
    ]
  },

  /* ---------------- Marquee (EDITABLE) ---------------- */
  marquee: [
    "Web Development", "Software Development", "Modern Frontend",
    "Backend Development", "APIs & Integrations", "Cloud Technology",
    "Automation", "Artificial Intelligence", "Generative AI",
    "Digital Products", "UI Engineering", "Emerging Tech"
  ],

  /* ---------------- Selected work — CONCEPT prototypes (EDITABLE) ----------------
     concept: true  →  renders the "CONCEPT" chip + prototype disclaimer.
     Keep concept:true until a project is replaced with real, verifiable work. */
  projects: [
    {
      id: "nova", index: "01", concept: true,
      title: "NOVA",
      headline: "Intelligence meets productivity.",
      scope: "AI Platform · Web App · Realtime",
      description: "NOVA is a concept for an AI-powered productivity platform — a calm workspace where generative models draft, summarize and organize, while the interface stays out of the way. Prototype scope: conversational assistant, smart document pipelines, realtime collaboration.",
      tags: ["Generative AI", "React", "Realtime", "UX Systems"],
      image: "assets/img/project-nova.webp",
      imageAlt: "Dark futuristic AI interface concept in violet light"
    },
    {
      id: "flow", index: "02", concept: true,
      title: "FLOW",
      headline: "Work, automated beautifully.",
      scope: "Automation · Workflows · Integrations",
      description: "FLOW is a prototype workflow-automation system for modern businesses — visual pipelines that connect apps, data and people. Prototype scope: drag-and-drop builder, 40+ integration nodes, execution monitoring and failure recovery.",
      tags: ["Automation", "Node.js", "APIs", "Systems Design"],
      image: "assets/img/project-flow.webp",
      imageAlt: "Luminous workflow streams flowing through dark nodes"
    },
    {
      id: "pulse", index: "03", concept: true,
      title: "PULSE",
      headline: "Every signal, live.",
      scope: "Analytics · Monitoring · Dashboards",
      description: "PULSE is a concept realtime-analytics platform — streaming metrics rendered as living dashboards with sub-second latency. Prototype scope: event ingestion, anomaly alerts, customizable visualization layers.",
      tags: ["Realtime Data", "Python", "Visualization", "Cloud"],
      image: "assets/img/project-pulse.webp",
      imageAlt: "Glowing data waveforms over a dark grid"
    },
    {
      id: "nexus", index: "04", concept: true,
      title: "NEXUS",
      headline: "One platform, every interaction.",
      scope: "Web Platform · Product · Interactive",
      description: "NEXUS is a prototype interactive web platform — a modular product surface where content, commerce and community converge. Prototype scope: component architecture, personalization engine, immersive storytelling pages.",
      tags: ["Next.js", "Product", "Interactive", "Design Systems"],
      image: "assets/img/project-nexus.webp",
      imageAlt: "Luminous concentric interface layers in dark space"
    }
  ],

  /* ---------------- 02 / Technology — philosophy (EDITABLE copy) ---------------- */
  philosophy: {
    kicker: "02 / Technology",
    heading: "What makes technology <em>worth building.</em>",
    rule: "TECHNOLOGY — INNOVATION — EXPERIENCE",
    principles: [
      {
        numeral: "I",
        title: "Technology, understood",
        text: "Systems, users and constraints come before code. Understanding the problem deeply is what makes the solution simple — every architecture starts from first principles, not from trends."
      },
      {
        numeral: "II",
        title: "Built for people",
        text: "The best technology disappears. Interfaces, automation and intelligence should feel inevitable — crafted around human behavior, not engineered around machine convenience."
      },
      {
        numeral: "III",
        title: "Designed to evolve",
        text: "Launch is a beginning, not an end. Modular systems, clean APIs and observable infrastructure mean every product can grow, adapt and survive its own success."
      }
    ]
  },

  /* ---------------- 03 / From idea to experience — build engine ---------------- */
  engine: {
    kicker: "03 / From idea to experience",
    heading: "From an idea <em>to an experience.</em>",
    lede: "Every build travels the same arc — from a rough sketch to a living product. Scrub through the stages.",
    cta: { label: "See the process", href: "#process" },
    stages: [
      {
        n: "01", code: "IDEA", title: "The sketch",
        text: "It starts loose — whiteboard flows, rough wireframes, impossible ideas. The goal is direction, not perfection: what should exist, and why.",
        image: "assets/img/engine-idea.webp",
        imageAlt: "Hand-sketched wireframes on dark paper"
      },
      {
        n: "02", code: "ARCHITECTURE", title: "The system",
        text: "Ideas become structure — data models, API contracts, component trees. Decisions made here decide whether the product scales or collapses.",
        image: "assets/img/engine-architecture.webp",
        imageAlt: "Abstract software architecture blueprint"
      },
      {
        n: "03", code: "PRODUCT", title: "The experience",
        text: "Systems become something you can touch — interfaces with motion, feedback and polish. The idea, finally alive in the browser.",
        image: "assets/img/engine-product.webp",
        imageAlt: "Finished digital product glowing on a dark stage"
      }
    ]
  },

  /* ---------------- 04 / Capabilities (EDITABLE) ---------------- */
  capabilities: {
    kicker: "04 / Capabilities",
    heading: "What I <em>can build.</em>",
    lede: "Five disciplines, one standard: production-grade work, engineered end to end.",
    rows: [
      {
        n: "01", title: "Web Development",
        text: "Fast, accessible, responsive websites and web apps — from marketing sites to complex platforms, built with modern tooling and obsessive attention to detail."
      },
      {
        n: "02", title: "Backend & APIs",
        text: "Robust server systems, REST APIs and integrations — data models, authentication, and services designed to be reliable under real load."
      },
      {
        n: "03", title: "Cloud & Deployment",
        text: "From local prototype to global production — cloud infrastructure, CI/CD pipelines and hosting architectures that deploy in minutes, not days."
      },
      {
        n: "04", title: "AI & Automation",
        text: "Generative-AI features, intelligent assistants and workflow automation — practical machine intelligence wired into real products, not demos."
      },
      {
        n: "05", title: "Interface Engineering",
        text: "Design systems, motion and micro-interaction — the craft layer where engineering meets design and products start to feel alive."
      }
    ]
  },

  /* ---------------- 05 / Digital experiences — live concept demos ---------------- */
  experiences: {
    kicker: "05 / Digital experiences",
    heading: "The next build <em>is interactive.</em>",
    lede: "Concept demos rendered live in your browser — hover, move, click. No two visits behave exactly the same.",
    cards: [
      {
        n: "01", code: "TERMINAL", title: "Live terminal",
        text: "A concept deployment pipeline, typed live. Click the card to replay the build.",
        kind: "terminal"
      },
      {
        n: "02", code: "PULSE", title: "Data pulse",
        text: "A realtime signal monitor concept — streaming waveforms drawn live on canvas.",
        kind: "wave"
      },
      {
        n: "03", code: "FIELD", title: "Interaction field",
        text: "A pointer-reactive particle field. Move your cursor across it and watch it respond.",
        kind: "field"
      }
    ]
  },

  /* ---------------- 06 / Technology stack (EDITABLE) ----------------
     note: one line shown on hover/select. Keep honest — list what is
     genuinely worked with, not aspirational keywords. */
  stack: {
    kicker: "06 / Technology stack",
    heading: "An ecosystem, <em>not a list.</em>",
    lede: "Hover or tap a node to inspect it. Technologies connect — so does the work.",
    hint: "Select a node",
    nodes: [
      { name: "JavaScript", note: "The core language — modern ES, async systems, browser APIs." },
      { name: "TypeScript", note: "Type-safe codebases that scale with teams and time." },
      { name: "React", note: "Component architecture for complex interactive interfaces." },
      { name: "Next.js", note: "Full-stack React — routing, rendering and APIs in one frame." },
      { name: "Node.js", note: "Server runtimes, CLIs and realtime backends." },
      { name: "Python", note: "Scripting, data pipelines and AI experimentation." },
      { name: "REST APIs", note: "Contract-first API design and third-party integrations." },
      { name: "SQL", note: "Relational modeling and queries that stay fast at scale." },
      { name: "Git", note: "Version control, branching discipline, clean history." },
      { name: "Cloud", note: "Deployments, serverless and infrastructure basics." },
      { name: "GenAI", note: "LLM-powered features — prompting, agents, RAG concepts." },
      { name: "Automation", note: "Pipelines and scripts that remove repetitive work." }
    ]
  },

  /* ---------------- 07 / Experiments — LAB (EDITABLE) ---------------- */
  experiments: {
    kicker: "07 / Experiments",
    heading: "The lab is <em>always open.</em>",
    lede: "Generative studies rendered live — creative coding sketches exploring motion, systems and chance. Scroll the rail.",
    note: "Rendered live in your browser · Canvas 2D",
    cards: [
      { code: "E01", title: "Drift",        kind: "flow",  text: "A flow-field particle study — a thousand agents following invisible currents." },
      { code: "E02", title: "Signal",       kind: "wave",  text: "Interfering waveforms — simple math, endless variation." },
      { code: "E03", title: "Lattice",      kind: "grid",  text: "A generative grid that breathes — order dissolving into rhythm." },
      { code: "E04", title: "Orbit",        kind: "orbit", text: "Bodies in quiet motion — gravity as a design tool." },
      { code: "E05", title: "Static",       kind: "noise", text: "Animated grain — the texture of the machine, made visible." }
    ]
  },

  /* ---------------- 08 / Process (generic-safe; EDITABLE copy) ---------------- */
  process: {
    kicker: "08 / Process",
    heading: "From idea <em>to launch.</em>",
    lede: "A clear path, agreed before the first line of code.",
    steps: [
      { n: "01", title: "Idea",         text: "Goals, users and constraints. We define what success looks like before anything is designed." },
      { n: "02", title: "Architecture", text: "System design, data models and tech choices — the blueprint everything else is built on." },
      { n: "03", title: "Development",  text: "Iterative builds in working slices. You see progress early and steer it often." },
      { n: "04", title: "Testing",      text: "Real devices, real edge cases. Performance, accessibility and reliability verified before launch." },
      { n: "05", title: "Launch",       text: "Deployed, monitored and documented — then improved. Launch day is the starting line." }
    ],
    foot: "CLEAR SCOPE · ITERATIVE BUILDS · DIRECT COMMUNICATION"
  },

  /* ---------------- 09 / About (EDITABLE — keep honest) ---------------- */
  about: {
    kicker: "09 / About",
    heading: "The human <em>behind the machine.</em>",
    portrait: "assets/img/about-portrait.webp",
    portraitAlt: "Silhouette placeholder portrait — replace with Farooq's photo",
    portraitCaption: "Portrait placeholder",
    paragraphs: [
      "Farooq is a technology specialist working across modern web platforms, intelligent systems and digital products. His focus is the full arc — from a rough idea to a polished, production-grade experience.",
      "This portfolio is a living prototype: a cinematic sketch of how he thinks and builds. As real projects ship, they will replace the concept work throughout this site — in the open, and in public."
    ],
    exploringLabel: "Currently exploring",
    exploring: ["Generative AI", "Realtime systems", "Creative coding", "Design engineering"] // EDITABLE
  },

  /* ---------------- 10 / Contact (EDITABLE) ---------------- */
  contact: {
    kicker: "10 / Contact",
    heading: "Have something to build? <em>Let's engineer it.</em>",
    lede: "Tell me where the idea stands and what you want to launch. I review every brief personally and reply with scope, approach and next steps.",
    checklist: [
      "Clear scope agreed before the build",
      "Prototype-first, iterate in the open",
      "Direct communication, no middlemen"
    ],
    form: {
      title: "Send a project brief",
      note: "Prototype form — opens your email client with the brief pre-filled.",
      submitLabel: "Send brief",
      projectTypes: ["Web platform", "AI / Automation", "API / Backend", "Interactive experience", "Something else"]
    }
  },

  /* ---------------- Socials (EDITABLE — "#" = placeholder) ---------------- */
  socials: [
    { label: "GitHub",    href: "#" },
    { label: "LinkedIn",  href: "#" },
    { label: "X",         href: "#" },
    { label: "Email",     href: "mailto:hello@farooq.tech" } // EDITABLE
  ],

  /* ---------------- Footer ---------------- */
  footer: {
    ctaLine1: "Let's build",
    ctaLine2: "something extraordinary.",
    directoryNote: "Technology, innovation and digital experiences.",
    colophon: "© 2026 Farooq · Concept portfolio — all projects shown are prototype concepts.",
    backToTop: "Back to top"
  }
};
