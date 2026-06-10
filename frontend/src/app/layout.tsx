import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, List, Users, BarChart3, Settings } from "lucide-react";

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Sistem Laundry Siswa",
  description: "Dashboard pemantauan RFID Laundry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-poppins bg-[#f8fafc] text-[#1e3a5f] antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col shadow-xl z-20 shrink-0">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b4d8] to-blue-500 flex items-center justify-center font-bold text-xl shadow-lg">
                👕
              </div>
              <span className="font-bold text-lg tracking-wide">LaundrySiswa</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium">
                <LayoutDashboard size={20} className="text-[#00b4d8]" />
                Dashboard
              </Link>
              <Link href="/log" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium">
                <List size={20} className="text-[#00b4d8]" />
                Log Laundry
              </Link>
              <Link href="/students" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium">
                <Users size={20} className="text-[#00b4d8]" />
                Data Siswa
              </Link>
              <Link href="/stats" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium">
                <BarChart3 size={20} className="text-[#00b4d8]" />
                Statistik
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium">
                <Settings size={20} className="text-[#00b4d8]" />
                Pengaturan
              </Link>
            </nav>
            
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#00b4d8] flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold">Admin</p>
                  <p className="text-xs text-white/50">Online</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f0f4f8]">
            {/* Header / Breadcrumb */}
            <header className="h-16 bg-white shadow-sm flex items-center px-8 shrink-0 z-10">
              <div className="text-sm font-medium text-slate-500">
                Sistem Laundry Siswa / <span className="text-[#1e3a5f]">Dashboard</span>
              </div>
            </header>
            
            {/* Page Content */}
            <div className="flex-1 overflow-auto p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
