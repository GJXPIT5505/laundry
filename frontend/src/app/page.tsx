'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Users, Clock, CheckCircle2 } from 'lucide-react';

type LogData = { rfid: string; nama: string; kelas: string; status: string; time: string };
type MasterData = { rfid: string; nama: string; kelas: string };

export default function DashboardPage() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [master, setMaster] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [toast, setToast] = useState<LogData | null>(null);
  
  const API_BASE = 'https://backend.gilangjanuar210.workers.dev'; // For MVP/local testing

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [logRes, masterRes] = await Promise.all([
        fetch(`${API_BASE}/api/sheets/log`),
        fetch(`${API_BASE}/api/sheets/master`)
      ]);
      
      if (logRes.ok && masterRes.ok) {
        const newLogs: LogData[] = await logRes.json();
        const newMaster: MasterData[] = await masterRes.json();
        
        // Detect new tap if logs length increased or top item changed
        if (logs.length > 0 && newLogs.length > 0) {
          if (newLogs[0].rfid !== logs[0].rfid || newLogs[0].time !== logs[0].time) {
            showToast(newLogs[0]);
          }
        }

        setLogs(newLogs);
        setMaster(newMaster);
        setLastFetch(new Date());
        
        // Save to cache
        localStorage.setItem('laundry_logs', JSON.stringify(newLogs));
        localStorage.setItem('laundry_master', JSON.stringify(newMaster));
      }
    } catch (error) {
      console.error("Error fetching data", error);
      // Fallback to cache
      const cachedLogs = localStorage.getItem('laundry_logs');
      const cachedMaster = localStorage.getItem('laundry_master');
      if (cachedLogs) setLogs(JSON.parse(cachedLogs));
      if (cachedMaster) setMaster(JSON.parse(cachedMaster));
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Auto refresh every 5 seconds for real-time feel
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (log: LogData) => {
    setToast(log);
    setTimeout(() => setToast(null), 5000);
  };

  // Calculate Stats
  const totalTaps = logs.length;
  const totalRegistered = master.length;
  const processing = logs.filter(l => l.status === 'Diproses').length;
  const completed = logs.filter(l => l.status === 'Selesai').length;

  return (
    <div className="space-y-8 relative">
      {/* Header & Live Indicator */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Dashboard Utama</h1>
          <p className="text-slate-500 mt-1">Ringkasan aktivitas sistem laundry RFID</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-bold text-red-500">LIVE</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <span className="text-xs text-slate-400">
            {lastFetch ? `Update: ${lastFetch.toLocaleTimeString()}` : 'Menunggu...'}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Tap Hari Ini</p>
            <h3 className="text-3xl font-bold text-[#1e3a5f]">{loading && !logs.length ? '-' : totalTaps}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Siswa Terdaftar</p>
            <h3 className="text-3xl font-bold text-[#1e3a5f]">{loading && !master.length ? '-' : totalRegistered}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Sedang Diproses</p>
            <h3 className="text-3xl font-bold text-[#1e3a5f]">{loading && !logs.length ? '-' : processing}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Selesai Hari Ini</p>
            <h3 className="text-3xl font-bold text-[#1e3a5f]">{loading && !logs.length ? '-' : completed}</h3>
          </div>
        </div>
      </div>

      {/* Quick Preview Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-[#1e3a5f]">Aktivitas Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Siswa</th>
                <th className="px-6 py-4 font-medium">Kelas</th>
                <th className="px-6 py-4 font-medium">Waktu</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !logs.length ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
              ) : logs.slice(0, 5).map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#1e3a5f]">{log.nama}</div>
                    <div className="text-xs text-slate-400">{log.rfid}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{log.kelas}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(log.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      log.status === 'Diproses' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification for New Tap */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-white p-4 rounded-2xl shadow-2xl border border-[#00b4d8]/20 flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00b4d8] to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {toast.nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-[#00b4d8] mb-0.5">TAP BARU TERDETEKSI</div>
            <p className="font-bold text-[#1e3a5f] leading-tight">{toast.nama}</p>
            <p className="text-xs text-slate-500">Kelas {toast.kelas} • {new Date(toast.time).toLocaleTimeString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
