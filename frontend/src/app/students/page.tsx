'use client';

import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';

type MasterData = { rfid: string; nama: string; kelas: string };

export default function MasterSiswaPage() {
  const [students, setStudents] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<MasterData | null>(null);
  
  const API_BASE = 'https://backend.gilangjanuar210.workers.dev';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const masterRes = await fetch(`${API_BASE}/api/sheets/master`);
        
        if (masterRes.ok) {
          const newMaster = await masterRes.json();
          setStudents(newMaster);
          localStorage.setItem('laundry_master', JSON.stringify(newMaster));
        }
      } catch (error) {
        const cachedMaster = localStorage.getItem('laundry_master');
        if (cachedMaster) setStudents(JSON.parse(cachedMaster));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredStudents = students.filter(s => 
    s.kelas.toLowerCase().includes(search.toLowerCase()) ||
    s.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Data Siswa</h1>
          <p className="text-slate-500 mt-1">Master data siswa terdaftar di sistem</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau kelas..."
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && students.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Memuat data siswa...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Tidak ada data ditemukan.</td></tr>
              ) : filteredStudents.map((student, idx) => {
                return (
                  <tr 
                    key={idx} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="px-6 py-4 text-sm text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{student.rfid}</td>
                    <td className="px-6 py-4 font-semibold text-[#1e3a5f]">{student.nama}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{student.kelas}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Popup Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-800 p-8 text-center relative">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 mb-4 shadow-lg backdrop-blur-md">
                <User size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedStudent.nama}</h2>
              <span className="inline-block px-3 py-1 bg-[#00b4d8] text-white text-xs font-bold rounded-full">
                Kelas {selectedStudent.kelas}
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 text-sm font-medium">RFID UID</span>
                <span className="font-mono text-sm text-[#1e3a5f] font-bold">{selectedStudent.rfid}</span>
              </div>
              
              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-full mt-2 py-3 bg-[#1e3a5f] hover:bg-blue-900 text-white rounded-xl font-bold transition-colors shadow-md"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
