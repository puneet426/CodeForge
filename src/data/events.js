// =====================================================================
// EVENTS — single source of truth for the whole site.
//
// • An event shows under "Upcoming" until its `end` (or `start`) time has
//   passed, then moves to "Past Events" automatically. No manual moving.
// • To add an event: copy a block, give it a unique `slug`, put its poster in
//   /public/events/<slug>/ and fill in the fields. Newest first is not
//   required — the site sorts by date.
// • `category` is used by the filter chips on the Events page:
//   "Induction" | "Workshop" | "Session" | "Competition" | "Hackathon" | "Community"
// =====================================================================

const IST = "+05:30";

export const events = [
  // ------------------------------------------------------------------ UPCOMING
  {
    slug: "orientation-26",
    title: "ORIENTATION'26",
    tagline: "Your journey with <Code/Forge> starts here.",
    category: "Induction",
    start: `2026-11-20T16:00:00${IST}`,
    dateLabel: "20 Nov 2026",
    time: "4:00 PM",
    venue: "NIAMT Auditorium",
    banner: "/media/orientation26-poster.jpg",
    trailer: "/media/orientation26-trailer.mp4",
    featured: true,
    registration: true,
    description:
      "The official orientation of Code Forge for the new batch. Meet the team and the mentors, discover our communities — Software Development, AI & Data Science, Cybersecurity & Blockchain, Electronics & Automation and the Media Cell — and see what you can build with us this year.",
    highlights: [
      "Meet the core team, community leads & faculty advisors",
      "Walkthrough of every Code Forge community and how to join",
      "What's coming up: workshops, ForgeX Week, contests & hackathons",
      "Q&A — ask us anything about coding, clubs and careers",
    ],
  },

  // ------------------------------------------------------------------ 2026
  {
    slug: "devfest-prehype-26",
    title: "DevFest 2026 On-Campus Pre-Hype",
    category: "Community",
    start: `2026-10-10T14:00:00${IST}`,
    dateLabel: "10 Oct 2026",
    time: "2:00 PM onwards",
    venue: "Red Building (Lecture Hall)",
    collab: "GDG Ranchi",
    banner: "/events/devfest-prehype-26/01.webp",
    description:
      "Code Forge, in collaboration with GDG Ranchi, organised the DevFest 2026 on-campus pre-hype event. The session introduced students to Google Developer Groups, their community initiatives and the significance of DevFest in the technology ecosystem — with networking, skill-building and career opportunities through developer events.",
    highlights: [
      "Introduction to GDG and its developer community",
      "Insights into DevFest 2026 and careers in tech",
      "Interactive tech quizzes, games and activities",
      "Competitions with official GDG swags & goodies for winners",
      "Participation from students across all years",
    ],
  },
  {
    slug: "frontend-sprint",
    title: "Frontend Development Sprint",
    category: "Competition",
    start: `2026-08-25T17:30:00${IST}`,
    dateLabel: "25 Aug 2026",
    time: "5:30 PM – 8:00 PM",
    venue: "LHC 107",
    banner: "/events/frontend-sprint/01.webp",
    description:
      "A time-bound practice challenge where teams of three designed and built attractive, responsive and interactive websites with HTML, CSS and JavaScript — encouraging creativity, problem solving, healthy competition and hands-on learning.",
    highlights: ["Team challenge (teams of 3)", "HTML, CSS & JavaScript", "Projects built by the fresher batch"],
    gallery: [
      "/events/frontend-sprint/02.webp",
      "/events/frontend-sprint/03.webp",
      "/events/frontend-sprint/04.webp",
      "/events/frontend-sprint/05.webp",
      "/events/frontend-sprint/06.webp",
    ],
    galleryTitle: "Projects made by the fresher batch",
  },
  {
    slug: "finance-webinar",
    title: "Finance Webinar by Fin Maverick",
    category: "Session",
    start: `2026-08-17T18:00:00${IST}`,
    dateLabel: "17 Aug 2026",
    venue: "Online (Google Meet)",
    collab: "Fin Maverick",
    banner: null,
    description:
      "“Beyond the Classroom: Building a Career in Finance” — a webinar on career paths and industry expectations across Investment Banking, Equity Research, Venture Capital, Private Equity, Corporate Finance, Financial Markets and FinTech, followed by an online case-study competition on the Fin Maverick platform.",
    highlights: [
      "Insights into finance careers and industry expectations",
      "Hands-on financial case analysis and problem solving",
      "Digital certificates for participants, recognition for top performers",
      "Complimentary Technical Analysis course access for attendees",
    ],
  },
  {
    slug: "n8n-automation",
    title: "n8n Automation Session",
    category: "Workshop",
    start: `2026-04-18T14:15:00${IST}`,
    dateLabel: "18 Apr 2026",
    time: "2:15 PM – 4:00 PM",
    venue: "ITnC Lab",
    banner: "/events/n8n-automation/01.webp",
    description:
      "An introduction to no-code workflow automation with n8n: how WhatsApp chatbots work, how apps talk to each other through APIs, and how emails, notifications and routine tasks can be automated — ending with a live demo of building a first workflow.",
    highlights: ["How WhatsApp chatbots work", "APIs and app-to-app communication", "Automating emails & notifications", "Live: build your first workflow"],
  },
  {
    slug: "riot-robotics",
    title: "Robotics Workshop by R.I.O.T",
    category: "Workshop",
    start: `2026-03-23T15:00:00${IST}`,
    dateLabel: "23 Mar 2026",
    time: "3:00 PM onwards",
    venue: "Admin Building, 2nd Floor",
    collab: "R.I.O.T — Robotics & IoT Wing, IIIT Ranchi",
    banner: "/events/riot-robotics/01.webp",
    description:
      "R.I.O.T, the Robotics & IoT wing of IIIT Ranchi, ran a hands-on robotics workshop at NIAMT with live robot demonstrations, an RC plane showcase and an interactive session on robot components, construction and programming — and introduced YANTRA, the robotics fest at IIIT Ranchi.",
    highlights: ["Live robot demonstrations", "RC plane showcase", "Robot components, build & programming", "Outreach for YANTRA robotics fest"],
  },
  {
    slug: "js-webdev",
    title: "Introduction to JS & WebDev",
    category: "Workshop",
    start: `2026-02-24T17:30:00${IST}`,
    end: `2026-02-26T19:30:00${IST}`,
    dateLabel: "24 – 26 Feb 2026",
    time: "5:30 PM",
    venue: "ITnC Lab",
    banner: "/events/js-webdev/01.webp",
    description:
      "A beginner-friendly, three-day hands-on workshop to kick-start web development — from a complete roadmap to HTML/CSS fundamentals, JavaScript basics and DOM concepts with a mini project.",
    highlights: ["Complete web development roadmap", "HTML & CSS fundamentals", "JavaScript basics", "DOM concepts & mini project"],
  },
  {
    slug: "intro-llms",
    title: "Introduction to LLMs",
    category: "Session",
    start: `2026-02-21T11:00:00${IST}`,
    dateLabel: "21 Feb 2026",
    time: "11:00 AM",
    venue: "ITnC Lab",
    banner: "/events/intro-llms/01.webp",
    description:
      "Ever wondered how ChatGPT actually works? This session broke down Large Language Models — transformers and attention, how LLMs are trained, and where they are used in the real world.",
    highlights: ["What are Large Language Models?", "Transformers & the attention mechanism", "How LLMs are trained", "Real-world applications"],
  },
  {
    slug: "forgex-league",
    title: "ForgeX League by Matiks",
    category: "Competition",
    start: `2026-02-15T00:00:00${IST}`,
    end: `2026-02-21T23:59:00${IST}`,
    dateLabel: "15 – 21 Feb 2026",
    venue: "Online — play anywhere",
    collab: "Matiks",
    banner: "/events/forgex-league/01.webp",
    description:
      "A week-long challenge where speed meets strategy: compete, earn XP, climb the leaderboard and prove your problem-solving skills — solo or with friends.",
    highlights: ["Prizes worth ₹3K – ₹10K+", "Exclusive Matiks T-shirts for winners", "Play anytime, anywhere"],
  },
  {
    slug: "forgex-week",
    title: "ForgeX Week",
    category: "Workshop",
    start: `2026-01-27T17:30:00${IST}`,
    end: `2026-02-03T19:00:00${IST}`,
    dateLabel: "27 Jan – 03 Feb 2026",
    time: "5:30 PM",
    venue: "LHC 101 / LHC 103",
    banner: "/events/forgex-week/01.webp",
    description:
      "Five sessions, five domains. ForgeX Week took students from open source to competitive programming, Arduino, AI/ML and cybersecurity — one hands-on session each day.",
    sessions: [
      { day: "Day 1", title: "Introduction to Git & GitHub", date: "27 Jan", venue: "LHC 101", note: "Open source, pull requests, issues — and making your first contribution." },
      { day: "Day 2", title: "Introduction to Competitive Programming", date: "28 Jan", venue: "LHC 103", note: "CP mindset, time & space complexity, STL and live problem solving." },
      { day: "Day 3", title: "Workshop on Arduino Programming", date: "29 Jan", venue: "LHC 103", note: "What Arduino is, prototyping and the Arduino ecosystem." },
      { day: "Day 4", title: "Introduction to AI & ML", date: "02 Feb", venue: "LHC 103", note: "AI vs ML vs DL vs GenAI, ML techniques and careers in AI." },
      { day: "Day 5", title: "Introduction to Cybersecurity", date: "03 Feb", venue: "LHC 103", note: "Cyber threats, malware, passwords and authentication basics." },
    ],
    gallery: [
      "/events/forgex-week/02.webp",
      "/events/forgex-week/03.webp",
      "/events/forgex-week/04.webp",
      "/events/forgex-week/05.webp",
      "/events/forgex-week/06.webp",
      "/events/forgex-week/07.webp",
      "/events/forgex-week/08.webp",
    ],
  },
  {
    slug: "induction-2026",
    title: "Student Induction Programme 2026",
    category: "Induction",
    start: `2026-01-21T17:00:00${IST}`,
    dateLabel: "21 Jan 2026",
    time: "5:00 PM",
    venue: "Auditorium",
    banner: "/events/induction-2026/01.webp",
    description:
      "The Code Forge induction for the first-year batch of 2025–29, with faculty guidance, an introduction to every Code Forge community, the Code Forge Quiz Arena and an On-the-Spot challenge.",
    highlights: ["Faculty guidance", "Introduction to the communities of Code Forge", "Code Forge Quiz Arena", "On-the-Spot Challenge"],
    gallery: ["/events/induction-2026/02.webp", "/events/induction-2026/03.webp"],
  },
  {
    slug: "sticker-contest",
    title: "Sticker Making Contest",
    category: "Competition",
    start: `2026-01-20T17:00:00${IST}`,
    dateLabel: "20 Jan 2026",
    banner: "/events/sticker-contest/banner.webp",
    description:
      "A design contest to sharpen graphic-design skills with tools like Canva and Adobe Illustrator. Here are a few of the stickers our students made.",
    gallery: [
      "/events/sticker-contest/01.webp",
      "/events/sticker-contest/02.webp",
      "/events/sticker-contest/03.webp",
      "/events/sticker-contest/04.webp",
      "/events/sticker-contest/05.webp",
    ],
    galleryTitle: "Stickers made by NIAMT students",
  },
  {
    slug: "ranchi-hacks-26",
    title: "Ranchi Hacks '26",
    category: "Hackathon",
    start: `2026-01-18T09:00:00${IST}`,
    dateLabel: "18 Jan 2026",
    collab: "GDG Ranchi",
    banner: "/events/ranchi-hacks-26/01.webp",
    description:
      "A hackathon organised by Google Developer Groups Ranchi in collaboration with Code Forge NIAMT, open to students from colleges across Ranchi — with strong participation from Code Forge members. Code Forge received a Certificate of Appreciation for its support and contribution.",
  },

  // ------------------------------------------------------------------ 2025 (from the previous site)
  {
    slug: "rtime-2025",
    title: "rTIME-2025",
    category: "Community",
    start: `2025-12-15T10:00:00${IST}`,
    dateLabel: "Dec 2025",
    banner: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766561082/Untitled_design_18_xt1stb.png",
  },
  {
    slug: "c-programming-workshop",
    title: "Workshop on C Programming",
    category: "Workshop",
    start: `2025-11-15T10:00:00${IST}`,
    dateLabel: "Nov 2025",
    banner: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766561582/Untitled_design_19_qsgpvx.png",
  },
  {
    slug: "cybersecurity-workshop-2025",
    title: "5-Day Cyber Security Workshop",
    category: "Workshop",
    start: `2025-10-20T10:00:00${IST}`,
    dateLabel: "Oct 2025",
    banner: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766563498/code_forge_website_designs_qwiknb.png",
  },
  {
    slug: "sih-2025",
    title: "SIH-2025 (Internal Round)",
    category: "Hackathon",
    start: `2025-10-05T10:00:00${IST}`,
    dateLabel: "Oct 2025",
    banner: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766564063/Internal_SIH_OCT_2025_Landscape_1_tlrtgn.png",
  },
  {
    slug: "tech-talk-jul-2025",
    title: "Tech Talk",
    category: "Session",
    start: `2025-07-15T10:00:00${IST}`,
    dateLabel: "Jul 2025",
    banner: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766582739/code_forge_website_designs_1_nftss4.png",
  },
  // The three events below used LinkedIn-hosted images whose links expire.
  // Upload their posters to /public/events/<slug>/ and set `banner` again.
  { slug: "tech-talk-apr-2025", title: "Tech Talk", category: "Session", start: `2025-04-15T10:00:00${IST}`, dateLabel: "Apr 2025", banner: null },
  { slug: "kartavya-2025", title: "Kartavya Tech Event × <Code/Forge>", category: "Community", start: `2025-03-07T10:00:00${IST}`, dateLabel: "Mar 2025", banner: null },
  { slug: "tech-talk-feb-2025", title: "Tech Talk", category: "Session", start: `2025-02-15T10:00:00${IST}`, dateLabel: "Feb 2025", banner: null },
];

// ------------------------------------------------------------------ helpers
const endOf = (e) => new Date(e.end || e.start).getTime() + (e.end ? 0 : 3 * 3600 * 1000);

export const getUpcoming = (now = Date.now()) =>
  events.filter((e) => endOf(e) > now).sort((a, b) => new Date(a.start) - new Date(b.start));

export const getPast = (now = Date.now()) =>
  events.filter((e) => endOf(e) <= now).sort((a, b) => new Date(b.start) - new Date(a.start));

export const CATEGORIES = ["All", "Workshop", "Session", "Competition", "Hackathon", "Induction", "Community"];
