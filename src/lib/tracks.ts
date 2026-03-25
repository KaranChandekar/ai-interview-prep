import { Track } from "@/types";

export const tracks: Record<string, Track> = {
  frontend: {
    id: "frontend",
    name: "Frontend Engineer",
    icon: "🎨",
    description: "React, CSS, performance, accessibility, and system design",
    categories: [
      "React & Components",
      "CSS & Layout",
      "Performance",
      "Accessibility",
      "JavaScript",
      "System Design",
    ],
    behavioralTopics: [
      "collaboration",
      "conflict-resolution",
      "leadership",
      "failure-stories",
    ],
  },
  backend: {
    id: "backend",
    name: "Backend Engineer",
    icon: "⚙️",
    description: "APIs, databases, system design, security, and scalability",
    categories: [
      "APIs & REST",
      "Databases",
      "System Design",
      "Security",
      "Scalability",
      "Algorithms",
    ],
    behavioralTopics: [
      "incident-response",
      "technical-debt",
      "mentoring",
      "cross-team-collaboration",
    ],
  },
  fullstack: {
    id: "fullstack",
    name: "Full Stack Engineer",
    icon: "🔗",
    description:
      "End-to-end development from frontend to backend and deployment",
    categories: [
      "Frontend Frameworks",
      "Backend & APIs",
      "Databases",
      "DevOps & CI/CD",
      "System Design",
      "Testing",
    ],
    behavioralTopics: [
      "ownership",
      "prioritization",
      "cross-functional",
      "tradeoff-decisions",
    ],
  },
  data: {
    id: "data",
    name: "Data Engineer",
    icon: "📊",
    description: "Data pipelines, SQL, distributed systems, and analytics",
    categories: [
      "SQL & Databases",
      "Data Pipelines",
      "Distributed Systems",
      "Data Modeling",
      "Analytics",
      "Cloud Platforms",
    ],
    behavioralTopics: [
      "data-quality",
      "stakeholder-management",
      "ambiguity",
      "impact-measurement",
    ],
  },
  devops: {
    id: "devops",
    name: "DevOps / SRE",
    icon: "🚀",
    description: "Infrastructure, CI/CD, monitoring, and reliability",
    categories: [
      "CI/CD Pipelines",
      "Infrastructure as Code",
      "Monitoring & Observability",
      "Containerization",
      "Cloud Services",
      "Incident Management",
    ],
    behavioralTopics: [
      "incident-response",
      "automation-mindset",
      "documentation",
      "risk-management",
    ],
  },
  mobile: {
    id: "mobile",
    name: "Mobile Engineer",
    icon: "📱",
    description:
      "iOS, Android, React Native, cross-platform development and mobile UX",
    categories: [
      "iOS & Swift",
      "Android & Kotlin",
      "React Native",
      "Mobile UI/UX",
      "App Architecture",
      "Performance & Battery",
    ],
    behavioralTopics: [
      "user-empathy",
      "platform-tradeoffs",
      "release-management",
      "cross-platform-decisions",
    ],
  },
  ml: {
    id: "ml",
    name: "ML Engineer",
    icon: "🧠",
    description:
      "Machine learning, deep learning, MLOps, and model deployment",
    categories: [
      "ML Fundamentals",
      "Deep Learning",
      "NLP & LLMs",
      "Computer Vision",
      "MLOps & Deployment",
      "Data Preprocessing",
    ],
    behavioralTopics: [
      "experiment-design",
      "stakeholder-communication",
      "ethical-ai",
      "research-to-production",
    ],
  },
  pm: {
    id: "pm",
    name: "Product Manager",
    icon: "📋",
    description:
      "Product strategy, roadmap planning, metrics, and user research",
    categories: [
      "Product Strategy",
      "User Research",
      "Metrics & Analytics",
      "Roadmap Planning",
      "Stakeholder Management",
      "Market Analysis",
    ],
    behavioralTopics: [
      "prioritization",
      "cross-functional-leadership",
      "data-driven-decisions",
      "handling-ambiguity",
    ],
  },
  qa: {
    id: "qa",
    name: "QA Engineer",
    icon: "🧪",
    description:
      "Test automation, quality strategy, CI testing, and bug management",
    categories: [
      "Test Automation",
      "Manual Testing",
      "API Testing",
      "Performance Testing",
      "CI/CD Testing",
      "Test Strategy",
    ],
    behavioralTopics: [
      "quality-advocacy",
      "developer-collaboration",
      "release-readiness",
      "risk-based-testing",
    ],
  },
  security: {
    id: "security",
    name: "Security Engineer",
    icon: "🔒",
    description:
      "Application security, threat modeling, pentesting, and compliance",
    categories: [
      "Application Security",
      "Network Security",
      "Threat Modeling",
      "Cryptography",
      "Compliance & Governance",
      "Incident Response",
    ],
    behavioralTopics: [
      "security-culture",
      "risk-communication",
      "incident-handling",
      "cross-team-security",
    ],
  },
  cloud: {
    id: "cloud",
    name: "Cloud Architect",
    icon: "☁️",
    description:
      "Cloud infrastructure, microservices, serverless, and cost optimization",
    categories: [
      "AWS / GCP / Azure",
      "Microservices",
      "Serverless",
      "Networking & VPC",
      "Cost Optimization",
      "High Availability",
    ],
    behavioralTopics: [
      "architecture-decisions",
      "vendor-evaluation",
      "migration-strategy",
      "cost-management",
    ],
  },
  ux: {
    id: "ux",
    name: "UX Designer",
    icon: "✨",
    description:
      "User experience, design systems, user research, and prototyping",
    categories: [
      "User Research",
      "Interaction Design",
      "Visual Design",
      "Design Systems",
      "Usability Testing",
      "Information Architecture",
    ],
    behavioralTopics: [
      "design-advocacy",
      "developer-handoff",
      "user-empathy",
      "design-critique",
    ],
  },
  dsa: {
    id: "dsa",
    name: "DSA & Algorithms",
    icon: "🧮",
    description:
      "Data structures, algorithms, problem solving, and competitive programming",
    categories: [
      "Arrays & Strings",
      "Trees & Graphs",
      "Dynamic Programming",
      "Sorting & Searching",
      "Linked Lists & Stacks",
      "Greedy & Backtracking",
    ],
    behavioralTopics: [
      "problem-decomposition",
      "optimization-thinking",
      "time-complexity",
      "edge-case-handling",
    ],
  },
  behavioral: {
    id: "behavioral",
    name: "Behavioral Interview",
    icon: "🤝",
    description:
      "Leadership, teamwork, conflict resolution, and STAR method practice",
    categories: [
      "Leadership & Influence",
      "Teamwork & Collaboration",
      "Conflict Resolution",
      "Problem Solving",
      "Communication",
      "Growth & Learning",
    ],
    behavioralTopics: [
      "star-method",
      "self-awareness",
      "adaptability",
      "decision-making",
    ],
  },
};

export type TrackKey = keyof typeof tracks;

export function getTrack(id: string): Track | undefined {
  return tracks[id];
}

export function getAllTracks(): Track[] {
  return Object.values(tracks);
}
