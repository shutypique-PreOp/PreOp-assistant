import type { Metadata } from "next";
import { Source_Sans_3, Syne } from "next/font/google";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PRODUCT_NAME, DISCLAIMER } from "@/lib/copy";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — Copilote préopératoire`,
  description:
    "Prototype d’assistant de consultation d’anesthésie pour la gestion préopératoire des médicaments. Aucune recommandation médicale.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${syne.variable} ${sourceSans.variable} antialiased`}>
        <div className="app-shell">
          <DisclaimerBanner />
          {children}
        </div>
        <span className="sr-only">{DISCLAIMER}</span>
      </body>
    </html>
  );
}
