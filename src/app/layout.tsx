import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnMute AI - AI-Powered language learning app",
  description:
    "UnMute AI is an AI-powered language learning app that helps you practice speaking and improve your pronunciation. With UnMute AI, you can have conversations with an AI tutor, receive instant feedback on your pronunciation, and track your progress over time. Whether you're a beginner or an advanced learner, UnMute AI is the perfect tool to help you become fluent in your target language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <main className="pt-24 grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
