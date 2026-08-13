import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed to Inter as per UI guidelines
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Omni-Ensiklopedia HSR",
  description: "Database Karakter, Relik, Light Cone, dan Profil UID Honkai: Star Rail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-[var(--background)] text-[var(--foreground)]`}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
