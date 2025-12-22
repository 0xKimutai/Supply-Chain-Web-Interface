import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, User as UserIcon, Shield } from 'lucide-react';

import DashboardHome from './DashboardHome';
import ProductList from './products/ProductList';
import ProductForm from './products/ProductForm';
import TrackingView from './tracking/TrackingView';

// Placeholder views (will keep for now)
const AnalyticsView = () => <div className="p-8"><div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
  <p className="text-slate-400 font-medium">Analytics reports are currently being compiled...</p>
</div></div>;

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  walletAddress: string;
}

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800">Supply Chain Dashboard</h2>
          </div>

          <div className="flex items-center space-x-6">
            {/* Wallet Address Chip */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs font-mono text-slate-600">
                {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(38)}
              </span>
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-white overflow-hidden shadow-inner">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/tracking" element={<TrackingView />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
