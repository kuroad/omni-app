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
      <body className={`${inter.className} min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}>
        <ReactQueryProvider>
          <div className="flex-1">
            {children}
          </div>
          <footer className="w-full text-center py-6 text-gray-500/60 text-xs border-t border-white/5 mt-8">
            <p>Omni-Ensiklopedia HSR &copy; 2026 • Versi 1.5.0 (Omni-Database Update)</p>
          </footer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
