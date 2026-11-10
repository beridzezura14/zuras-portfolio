export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
}

export const projectsData: Project[] = [
  {
    id: "1",
    slug: "salia-travel",
    title: "Salia Travel",
    category: "Travel Agency",
    year: 2026,
    shortDescription: "Modern travel agency website.",
    fullDescription:
      "A modern travel agency website featuring a tour catalog, detailed tour pages, and an inquiry form.",
    coverImage: "/projects/saliatravel.png",
    gallery: [],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    features: [
      "Responsive website",
      "Tour catalog",
      "Tour detail pages",
      "Inquiry form",
    ],
    liveUrl: "https://saliatravel.com",
    githubUrl: null,
    featured: true,
    published: true,
  },
  {
    id: "2",
    slug: "trust-point",
    title: "Trust Point",
    category: "Corporate Website",
    year: 2026,
    shortDescription: "Tax and legal services website.",
    fullDescription:
      "A professional corporate website for a tax and legal services company, featuring service pages, a blog, and an academy section.",
    coverImage: "/projects/trust-point.png",
    gallery: [],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    features: [
      "Responsive design",
      "Service pages",
      "Blog",
      "Academy section",
      "SEO optimization",
    ],
    liveUrl: "https://trust-point.ge",
    githubUrl: null,
    featured: true,
    published: true,
  },
  {
    id: "3",
    slug: "beauty-salon",
    title: "Beauty Salon",
    category: "Beauty & Wellness",
    year: 2026,
    shortDescription: "Modern beauty salon website.",
    fullDescription:
      "An elegant beauty salon website with a responsive interface, interactive sections, and smooth animations.",
    coverImage: "/projects/beauty-salon.png",
    gallery: [],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      "Responsive layout",
      "Service presentation",
      "Interactive animations",
      "Modern user interface",
    ],
    liveUrl: "https://beautysalon-sandy.vercel.app",
    githubUrl: null,
    featured: true,
    published: true,
  },
{
  id: "4",
  slug: "pudzemsheni",
  title: "Pudzemsheni",
  category: "Construction & E-commerce",
  year: 2026,

  shortDescription:
    "A modern construction products website featuring a product catalog, shopping cart, and admin dashboard.",

  fullDescription:
    "Pudzemsheni is a modern web application designed to showcase reinforced concrete and construction products online. The website features a product catalog, detailed categories, product galleries, a shopping cart, and contact forms. Built with Next.js and Supabase, it includes a secure admin dashboard for managing products, categories, and images. The platform also features dynamic product pages, SEO optimization, Google Analytics, a sitemap, and responsive design. Customer inquiries and order requests are delivered via email.",

  coverImage: "/projects/pudzemsheni.png",

  gallery: [],

  technologies: [
    "Next.js",
    "Tailwind CSS",
    "Supabase",
    "Swiper",
  ],

  features: [
    "Product catalog and categories",
    "Dynamic product detail pages",
    "Shopping cart functionality",
    "Secure admin dashboard",
    "Product and category management (CRUD)",
    "Image upload and management",
    "Supabase authentication and database",
    "Order and contact forms",
    "Email notifications",
    "SEO optimization and sitemap",
    "Google Analytics integration",
    "Responsive design",
  ],

  liveUrl: "https://pudzemsheni.ge/",
  githubUrl: null,

  featured: true,
  published: true,
},
];