'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Order = {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: { serviceId: number, quantity: number, price: number }[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      // In a real app, we would fetch only the logged-in user's orders using their token
      // e.g. GET /api/users/me/orders
      // Since we don't have that endpoint in the MVP yet, we'll mock it for the UI demonstration
      setOrders([
        { id: 101, status: 'washing', totalPrice: 45000, createdAt: new Date(Date.now() - 86400000).toISOString(), items: [] },
        { id: 102, status: 'delivered', totalPrice: 15000, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), items: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'washing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'delivered': return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">My Orders</h1>
          <p className="text-neutral-500 mt-1">Track the status of your laundry.</p>
        </div>
        <Link href="/dashboard/new" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          + New Order
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-neutral-500 mb-4">You have no laundry orders yet.</p>
          <Link href="/dashboard/new" className="text-indigo-600 font-medium hover:underline">
            Place your first order
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Order #{order.id}</h3>
                  <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative pt-1 mb-6">
                <div className="flex mb-2 items-center justify-between">
                  <div className="w-full flex justify-between text-xs font-medium text-neutral-500">
                    <span className={order.status === 'pending' || order.status === 'washing' || order.status === 'ready' || order.status === 'delivered' ? 'text-indigo-600 font-bold' : ''}>Pending</span>
                    <span className={order.status === 'washing' || order.status === 'ready' || order.status === 'delivered' ? 'text-indigo-600 font-bold' : ''}>Washing</span>
                    <span className={order.status === 'ready' || order.status === 'delivered' ? 'text-indigo-600 font-bold' : ''}>Ready</span>
                    <span className={order.status === 'delivered' ? 'text-indigo-600 font-bold' : ''}>Delivered</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-100">
                  <div style={{ width: order.status === 'pending' ? '25%' : order.status === 'washing' ? '50%' : order.status === 'ready' ? '75%' : '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <span className="text-neutral-500 font-medium">Total Amount</span>
                <span className="text-xl font-bold text-neutral-900">Rp {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
