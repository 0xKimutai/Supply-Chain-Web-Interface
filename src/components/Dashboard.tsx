import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, CheckCircle, LogOut, Menu, X } from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  walletAddress: string;
}

interface DashboardStats {
  totalProducts: number;
  created: number;
  inTransit: number;
  atDistributor: number;
  atRetailer: number;
  sold: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadUserData();
    loadDashboardStats();
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch('/api/v1/products/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MANUFACTURER': return 'bg-blue-100 text-blue-800';
      case 'DISTRIBUTOR': return 'bg-green-100 text-green-800';
      case 'RETAILER': return 'bg-purple-100 text-purple-800';
      case 'CUSTOMER': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-indigo-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && <h1 className="text-xl font-bold">Supply Chain</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-indigo-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            <a href="#" className="flex items-center p-3 rounded-lg bg-indigo-800">
              <Package className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </a>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-800">
              <TrendingUp className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Analytics</span>}
            </a>
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg hover:bg-indigo-800 w-full"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h2>
              <p className="text-gray-600 mt-1">
                {user.company} • {user.role}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <div className="text-right">
                <p className="text-sm font-mono text-gray-500">
                  {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(38)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.totalProducts || 0}
                  </p>
                </div>
                <Package className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Transit</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.inTransit || 0}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At Distributor</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.atDistributor || 0}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.sold || 0}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                + Create Product
              </button>
              <button className="p-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
                Update Location
              </button>
              <button className="p-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;