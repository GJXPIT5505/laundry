import React from 'react';

// Define the Service type matching our database schema
type Service = {
  id: number;
  name: string;
  description: string | null;
  pricePerUnit: number;
  unit: string;
};

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch('http://127.0.0.1:8787/api/services', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  } catch (error) {
    console.error("Backend not reachable. Using fallback services.", error);
    // Fallback data if backend is not running yet
    return [
      { id: 1, name: 'Wash & Fold', description: 'Standard everyday laundry', pricePerUnit: 15000, unit: 'kg' },
      { id: 2, name: 'Dry Cleaning', description: 'Special care for delicate items', pricePerUnit: 25000, unit: 'item' },
      { id: 3, name: 'Ironing Only', description: 'Crisp and wrinkle-free', pricePerUnit: 10000, unit: 'kg' },
    ];
  }
}

export default async function Home() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-lg">
              L
            </div>
            <span className="font-semibold text-lg tracking-tight">LaundryHub</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">Services</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">My Orders</a>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            Fresh laundry, <br /> delivered to your dorm.
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl leading-relaxed">
            Schedule a pickup, track your order, and pay seamlessly. We handle the dirty work so you can focus on your studies.
          </p>
          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              Schedule Pickup
            </button>
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl font-medium transition-all">
              View Pricing
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Our Services</h2>
              <p className="text-neutral-400">Choose the perfect care for your garments.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white/90">{service.name}</h3>
                <p className="text-neutral-400 text-sm mb-6 min-h-[40px]">
                  {service.description || "Premium laundry care."}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">Rp {service.pricePerUnit.toLocaleString()}</span>
                  <span className="text-neutral-500 text-sm">/{service.unit}</span>
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
