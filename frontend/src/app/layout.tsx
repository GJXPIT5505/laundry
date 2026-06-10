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
          {/* Desktop Sidebar (Hidden on Mobile) */}
          <aside className="hidden md:flex w-64 bg-[#1e3a5f] text-white flex-col shadow-xl z-20 shrink-0">
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

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f0f4f8] pb-16 md:pb-0">
            {/* Header / Breadcrumb */}
            <header className="h-16 bg-white shadow-sm flex justify-between items-center px-4 md:px-8 shrink-0 z-10">
              <div className="flex items-center gap-2 md:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00b4d8] to-blue-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                  👕
                </div>
                <span className="font-bold text-[#1e3a5f]">Laundry</span>
              </div>
              <div className="hidden md:block text-sm font-medium text-slate-500">
                Sistem Laundry Siswa / <span className="text-[#1e3a5f]">Dashboard</span>
              </div>
            </header>
            
            {/* Page Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              {children}
            </div>
          </main>

          {/* Mobile Bottom Navigation (Hidden on Desktop) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
            <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-[#00b4d8] transition-colors">
              <LayoutDashboard size={22} />
              <span className="text-[10px] font-medium mt-1">Home</span>
            </Link>
            <Link href="/log" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-[#00b4d8] transition-colors">
              <List size={22} />
              <span className="text-[10px] font-medium mt-1">Log</span>
            </Link>
            <Link href="/students" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-[#00b4d8] transition-colors">
              <Users size={22} />
              <span className="text-[10px] font-medium mt-1">Siswa</span>
            </Link>
            <Link href="/stats" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-[#00b4d8] transition-colors">
              <BarChart3 size={22} />
              <span className="text-[10px] font-medium mt-1">Stats</span>
            </Link>
          </nav>

        </div>
      </body>
    </html>
  );
}
