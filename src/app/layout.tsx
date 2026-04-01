import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KCars",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#060a12] text-[#f0f2f5] font-sans">
        {children}
      </body>
    </html>
  );
}
