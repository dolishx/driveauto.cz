import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://driveautocz.vercel.app"),
  title: {
    default: "DriveAuto | Autoprodejna ověřených vozů",
    template: "%s | DriveAuto",
  },
  description:
    "DriveAuto — česká autoprodejna ověřených vozů s nabídkou vozů, službami a osobními prohlídkami.",
  applicationName: "DriveAuto",
  appleWebApp: {
    title: "DriveAuto",
    capable: true,
  },
  openGraph: {
    title: "DriveAuto | Autoprodejna ověřených vozů",
    description:
      "Profesionální nabídka vozů DriveAuto, osobní prohlídky a služby kolem auta.",
    url: "https://driveautocz.vercel.app",
    siteName: "DriveAuto",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DriveAuto | Autoprodejna ověřených vozů",
    description:
      "Profesionální nabídka vozů DriveAuto, osobní prohlídky a služby kolem auta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-brand-navy">
        {children}
      </body>
    </html>
  );
}
