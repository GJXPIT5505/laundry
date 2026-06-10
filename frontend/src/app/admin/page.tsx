'use client';

import React, { useState, useEffect } from 'react';

type Order = {
  id: number;
  userName: string;
  userEmail: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  // Note: For local dev without a real token, we'll mock the JWT or rely on the backend accepting requests for MVP demonstration.
  // In a real scenario, this page would only render if the user has an 'admin' session token.

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // In a real app, include Authorization header with JWT token here
      const res = await fetch('https://backend.gilangjanuar210.workers.dev/api/orders', {
        headers: { 'Authorization': 'Bearer YOUR_MOCK_ADMIN_TOKEN' }
      });
      if (res.ok) {
        setOrders(await res.json());
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      // Fallback mock data if backend fails
      setOrders([
        { id: 101, userName: 'John Doe', userEmail: 'john@student.edu', status: 'pending', totalPrice: 45000, createdAt: new Date().toISOString() },
        { id: 102, userName: 'Jane Smith', userEmail: 'jane@student.edu', status: 'washing', totalPrice: 20000, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`https://backend.gilangjanuar210.workers.dev/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_MOCK_ADMIN_TOKEN'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleFileUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingId(id);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://backend.gilangjanuar210.workers.dev/api/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer YOUR_MOCK_ADMIN_TOKEN' },
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`Receipt uploaded successfully! URL: ${data.url}`);
      } else {
        alert('Failed to upload receipt');
      }
    } catch (error) {
      console.error('Upload error', error);
      alert('Error uploading receipt');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Admin Dashboard</h1>
            <p className="text-neutral-500">Manage laundry orders and upload receipts.</p>
          </div>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm">
              Admin Logged In
            </span>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-sm text-neutral-600">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Total Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">No active orders.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-900">#{order.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-neutral-900">{order.userName}</div>
                      <div className="text-xs text-neutral-500">{order.userEmail}</div>
                    </td>
                    <td className="p-4 font-medium">Rp {order.totalPrice.toLocaleString()}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-sm px-3 py-1.5 rounded-full font-medium border appearance-none cursor-pointer outline-none transition-colors
                          ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${order.status === 'washing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${order.status === 'ready' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${order.status === 'delivered' ? 'bg-neutral-100 text-neutral-700 border-neutral-200' : ''}
                        `}
                      >
                        <option value="pending">Pending</option>
                        <option value="washing">Washing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <label className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-colors
                          ${uploadingId === order.id ? 'bg-neutral-100 text-neutral-400 border-neutral-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}
                        `}>
                          {uploadingId === order.id ? 'Uploading...' : 'Upload Receipt'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(order.id, e)}
                            disabled={uploadingId === order.id}
                          />
                        </label>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
