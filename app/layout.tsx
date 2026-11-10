
import SiteChrome from "./components/SiteChrome";
import MotionProvider from "./components/MotionProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")),
  title: "Zura Beridze | Web Developer & IT Specialist",
  description: "Zura Beridze is a Web Developer and IT Specialist based in Tbilisi, Georgia. Explore projects, experience, and skills.",
  openGraph: {
    title: "Zura Beridze | Web Developer & IT Specialist",
    description: "Modern websites and digital experiences. Explore Zura’s portfolio and get in touch.",
    type: "website",
    locale: "en_US",
    siteName: "Zura Beridze",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/logo/tab.png", type: "image/png" }] },
};

async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const currentYear = await getCopyrightYear();
  return (
    <html
      lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var r=document.documentElement;var d=localStorage.getItem('zura-theme')!=='light';var a=localStorage.getItem('zura-accent');if(a==='green')a='lime';if(a==='lime'&&!d)a='blue';if(['blue','purple','orange','black','lime'].includes(a))r.setAttribute('data-accent',a);r.setAttribute('data-theme',d?'dark':'light')}catch{}` }} />
      </head>
      <body>
        <MotionProvider>
        <SiteChrome currentYear={currentYear}>{children}</SiteChrome>
        </MotionProvider>
      </body>
    </html>
  );
}
