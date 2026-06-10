'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

type LogData = { rfid: string; nama: string; kelas: string; status: string; time: string };

export default function LogLaundryPage() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const API_BASE = 'https://backend.gilangjanuar210.workers.dev'; // For MVP/local testing

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sheets/log`);
        if (res.ok) {
          const newLogs: LogData[] = await res.json();
          setLogs(newLogs);
          localStorage.setItem('laundry_logs', JSON.stringify(newLogs));
        }
      } catch (error) {
        const cachedLogs = localStorage.getItem('laundry_logs');
        if (cachedLogs) setLogs(JSON.parse(cachedLogs));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(l => 
    l.nama.toLowerCase().includes(search.toLowerCase()) || 
    l.kelas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Log Laundry</h1>
          <p className="text-slate-500 mt-1">Riwayat lengkap aktivitas tap RFID siswa</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full bg-white border border-slate-200 rounded-xl py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium w-16">No</th>
                <th className="px-6 py-4 font-medium">RFID UID</th>
                <th className="px-6 py-4 font-medium">Nama Siswa</th>
                <th className="px-6 py-4 font-medium">Kelas</th>
                <th className="px-6 py-4 font-medium">Waktu Tap</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Memuat data log...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Tidak ada data ditemukan.</td></tr>
              ) : filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{log.rfid}</td>
                  <td className="px-6 py-4 font-semibold text-[#1e3a5f]">{log.nama}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{log.kelas}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(log.time).toLocaleString('id-ID')}
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
    </div>
  );
}
