import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "@copilotkit/react-core/v2/styles.css";
import "./globals.css";
import "./databot.css";
import "./plan.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TahoePilot",
  description:
    "Multi-agent data platform — ask about tables, draft SQL, or run multi-step plans across specialists.",
};

const colorSchemeScript = `(function(){try{var k="tahoepilot-color-scheme";var s=localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
