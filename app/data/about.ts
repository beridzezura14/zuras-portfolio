export interface Experience {
  id: number;
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string[];
}

export interface Education {
  id: number;
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
}

export interface SkillGroup {
  id: number;
  category: string;
  skills: string[];
}

export interface Language {
  name: string;
  level: string;
}

export interface AboutData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  introduction: string;
  description: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  languages: Language[];
  socialLinks: {
    github: string;
    linkedin: string;
  };
}

export const aboutData: AboutData = {
  name: "Zura Beridze",

  title: "Full-Stack Developer & IT Specialist",

  location: "Tbilisi, Georgia",

  email: "zuraberidze12@gmail.com",

  phone: "+995 558 29 43 64",

  introduction:
    "I'm a developer passionate about building modern, functional, and visually engaging digital experiences.",

  description:
    "My professional journey combines hands-on IT experience with a strong interest in web development. With a background in technical support, telecommunications, and architectural design, I bring a practical, problem-solving mindset to every project. I specialize in building responsive, high-performance web applications using React, Next.js, and TypeScript, with a focus on clean design, usability, and modern development practices.",

  experience: [
    {
      id: 1,
      position: "IT Specialist",
      company: "Ministry of Defense of Georgia",
      startDate: "2022-02-01",
      endDate: null,
      description: [
        "Provide technical support to users and maintain IT systems.",
        "Diagnose and resolve hardware, software, and connectivity issues.",
        "Install, configure, and maintain software applications and computer equipment.",
      ],
    },
    {
      id: 2,
      position: "Architect & Land Surveyor",
      company: "Architectural Services Company",
      startDate: "2020-03-01",
      endDate: "2022-01-31",
      description: [
        "Prepared architectural drawings and technical documentation.",
        "Conducted land surveying and measurement activities.",
        "Worked with CAD software and technical project documentation.",
      ],
    },
    {
      id: 3,
      position: "Internet Installation Technician",
      company: "Global Erty",
      startDate: "2018-09-01",
      endDate: "2020-02-29",
      description: [
        "Installed and maintained internet connectivity services.",
        "Diagnosed and resolved network connectivity issues.",
        "Configured networking equipment and provided customer support.",
      ],
    },
  ],

  education: [
    {
      id: 1,
      institution: "Georgian Technical University",
      program: "Bachelor's Degree in Energy and Telecommunications",
      startDate: "2015-01-01",
      endDate: "2019-12-31",
    },
    {
      id: 2,
      institution: "Smart Academy",
      program: "Front-End Development — HTML, CSS, JavaScript",
      startDate: "2019-03-01",
      endDate: "2019-05-31",
    },
    {
      id: 3,
      institution: "Goal Oriented Academy",
      program: "Front-End Development — HTML, CSS, JavaScript, Python",
      startDate: "2023-09-01",
      endDate: "2024-04-30",
    },
    {
      id: 4,
      institution: "Smart Academy",
      program: "Back-End Development with Python",
      startDate: "2025-02-01",
      endDate: "2025-05-31",
    },
  ],

  skills: [
    {
      id: 1,
      category: "Frontend Development",
      skills: [
        "HTML5",
        "CSS3",
        "Sass",
        "JavaScript",
        "TypeScript",
        "React.js",
        "Next.js",
        "Tailwind CSS",
        "GSAP",
        "Framer Motion",
      ],
    },
    {
      id: 2,
      category: "Backend & Databases",
      skills: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Supabase",
        "Firebase",
        "Python",
      ],
    },
    {
      id: 3,
      category: "Tools & Platforms",
      skills: [
        "Git",
        "GitHub",
        "VS Code",
        "Figma",
        "Vercel",
        "Netlify",
      ],
    },
    {
      id: 4,
      category: "IT & Technical Support",
      skills: [
        "Hardware Troubleshooting",
        "Software Installation",
        "System Configuration",
        "Network Troubleshooting",
        "Technical Support",
      ],
    },
  ],

  languages: [
    {
      name: "Georgian",
      level: "Native",
    },
    {
      name: "English",
      level: "Intermediate (B1)",
    },
  ],

  socialLinks: {
    github: "https://github.com/beridzezura14",
    linkedin: "https://www.linkedin.com/in/zura-beridze-a39725197/",
  },
};