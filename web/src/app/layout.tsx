import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechMaster — Learning Platform",
  description: "Personal learning hub: Salesforce, AI, Cloud, and more",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Sidebar />
        <main className="ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
