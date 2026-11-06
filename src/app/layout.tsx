import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

// Body: Inter — highly legible UI sans.  Display: Space Grotesk — technical, "mission control" headings.
// Mono: JetBrains Mono — telemetry, labels and numbers.  Equations are typeset by KaTeX (Latin Modern style).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const title = 'Flame in Freefall — SI-Powered NASA Microgravity Fire Safety Dashboard';
const description =
  '2026 NASA Space Apps Challenge: SI-powered dashboard summarizing, ranking, and interpreting NASA microgravity combustion findings (PSI, CIR, SoFIE, Saffire, FLEX, BASS) for Lunar & Mars exploration fire safety.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07090e',
};

// Runs before first paint so the saved theme is applied without a flash / hydration mismatch.
const themeInitScript = `(function(){try{var t=localStorage.getItem('fim_theme');var r=document.documentElement;if(t==='lab'){r.classList.add('lab-mode');}else{r.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-dvh">
        {children}
      </body>
    </html>
  );
}
