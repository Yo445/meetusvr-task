import type { Metadata } from "next";
import { ABeeZee } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/providers";

const abeezee = ABeeZee({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-abeezee",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeetusVR Auth",
  description: "Login → Dashboard (Next.js + Zustand)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${abeezee.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
