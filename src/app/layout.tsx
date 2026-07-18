import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/custom-cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Swapper - Trade Skills, Not Money",
  description: "The premium skill exchange platform. Exchange knowledge, teach what you know, and learn what you need - without money. Intelligently matching developers, designers, and creatives worldwide.",
  keywords: ["Skill swap", "learn coding", "design exchange", "teach python", "barter skills", "peer learning"],
  authors: [{ name: "Skill Swapper Team" }],
  openGraph: {
    title: "Skill Swapper - Trade Skills, Not Money",
    description: "Exchange knowledge, teach what you know, and learn what you need. Real startup quality matching engine.",
    type: "website",
  }
};

export default function RootLayout({
  children,
  modal, // Supporting future intercepting routes if needed
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-primary/30 selection:text-white`}
      >
        <CustomCursor />
        {children}
        {modal}
      </body>
    </html>
  );
}
