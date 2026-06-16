import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NordicSave — Sänk dina månadskostnader, utan att lyfta ett finger",
  description:
    "NordicSave analyserar och sänker dina kostnader för bredband och streaming. Du betalar bara om vi lyckas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className={`${interTight.variable} ${inter.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
