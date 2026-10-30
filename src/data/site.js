// Site-wide content: links, stats, communities preview, FAQ, gallery.
export const LINKS = {
  instagram: "https://www.instagram.com/codeforgeniamt",
  linkedin: "https://www.linkedin.com/company/code-forgeniamt",
  github: "https://github.com/codeforgeNIAMT",
  whatsapp: "https://chat.whatsapp.com/BlBNJT7f9XqC7s23myGI5k",
  email: "codeforgeniamt@gmail.com",
  niamt: "https://niamt.ac.in/",
};

export const ABOUT_SHORT =
  "<Code/Forge> is the coding club of NIAMT Ranchi under the Department of Electronics and Computer Engineering — a place where engineering, automation, computation and software come together. Through hands-on projects, coding challenges, workshops and peer learning, we help students turn ideas into real solutions.";

// `count` animates; `suffix` is appended.
export const STATS = [
  { label: "Students Trained", count: 100, suffix: "+" },
  { label: "Workshops Conducted", count: 10, suffix: "+" },
  { label: "Projects Built", count: 50, suffix: "+" },
  { label: "Communities", count: 5, suffix: "" },
];

export const COMMUNITIES = [
  { key: "sd", icon: "</>", title: "Software Development", blurb: "DSA, competitive programming, full-stack web & app development, Git and open source." },
  { key: "ai", icon: "AI", title: "Data Science & AI", blurb: "Python, machine learning, deep learning and data storytelling on real problems." },
  { key: "cy", icon: "#!", title: "Cybersecurity & Blockchain", blurb: "Linux, networking, ethical hacking, cryptography and smart contracts." },
  { key: "ea", icon: "⚙", title: "Electronics & Automation", blurb: "Arduino, embedded systems, robotics and automation projects." },
  { key: "mc", icon: "◉", title: "Media Cell & Events", blurb: "Design, photography, video, social media and running every Code Forge event." },
];

export const FAQ = [
  {
    q: "Who can join Code Forge?",
    a: "Any NIAMT student who wants to learn and build. Many of our sessions are designed for 1st and 2nd year students, and students from every branch take part.",
  },
  {
    q: "Do I need to know coding already?",
    a: "No. Our workshops start from the basics — Git & GitHub, C, Python, web development — and build up from there. Curiosity is the only prerequisite.",
  },
  {
    q: "How do I join?",
    a: "Come to ORIENTATION'26, register for any upcoming event on this site, and join our WhatsApp community to get every update first.",
  },
  {
    q: "Which community should I pick?",
    a: "Start with whatever excites you — you can attend sessions across communities. The orientation walks you through each one.",
  },
  {
    q: "What is the Leaderboard?",
    a: "It tracks scores from Code Forge contests and challenges. Compete, climb the board and get recognised.",
  },
];

export const GALLERY = [
  { src: "/gallery/g01.webp", caption: "Hands-on lab session" },
  { src: "/gallery/g02.webp", caption: "ForgeX Week · Quiz Competition winner" },
  { src: "/gallery/g03.webp", caption: "ForgeX Week · Topic on the Spot winner" },
  { src: "/gallery/g04.webp", caption: "Getting Started with IDE" },
  { src: "/gallery/g05.webp", caption: "ForgeX Week · Sticker Making Contest winner" },
  { src: "/gallery/g06.webp", caption: "Classroom session" },
  { src: "/gallery/g07.webp", caption: "A packed hall" },
  { src: "/gallery/g08.webp", caption: "The Code Forge team" },
  { src: "/gallery/g09.webp", caption: "Workshop in the lab" },
  { src: "/gallery/g10.webp", caption: "On stage with Google Developer Groups" },
  { src: "/gallery/g11.webp", caption: "Students at a session" },
  { src: "/gallery/g12.webp", caption: "Getting Started with IDE" },
  { src: "/gallery/g13.webp", caption: "Did you know? git ≠ GitHub" },
  { src: "/gallery/g14.webp", caption: "Certificates for participants" },
  { src: "/gallery/g15.webp", caption: "Electronics session" },
  { src: "/gallery/g16.webp", caption: "Lab session" },
  { src: "/gallery/g17.webp", caption: "Building together" },
  { src: "/gallery/g18.webp", caption: "Project showcase" },
  { src: "/gallery/g19.webp", caption: "Full house" },
  { src: "/gallery/g20.webp", caption: "Sensors & microcontrollers" },
  { src: "/gallery/g21.webp", caption: "Git & GitHub session" },
  { src: "/gallery/g22.webp", caption: "Hands-on practice" },
  { src: "/gallery/g23.webp", caption: "Session in progress" },
  { src: "/gallery/g24.webp", caption: "Code in action" },
  { src: "/gallery/g25.webp", caption: "Careers & internships talk" },
];
