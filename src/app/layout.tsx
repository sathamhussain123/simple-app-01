import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "satham-Hussain-AeroSync POS",
  description: "A premium point of sale application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col lg:flex-row bg-slate-950 text-slate-50 min-h-screen overflow-x-hidden selection:bg-indigo-500/30`}>
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 min-h-screen pt-20 pb-10 px-4 md:px-8 lg:p-10 overflow-auto bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-3xl relative">
            {/* Subtle Ambient Glow Effect */}
            <div className="absolute top-0 right-0 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-indigo-600/10 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-sky-600/10 rounded-full blur-[60px] lg:blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 w-full max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
