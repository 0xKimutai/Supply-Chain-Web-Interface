import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  created: number;
  inTransit: number;
  atDistributor: number;
  atRetailer: number;
  sold: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch('/api/v1/dashboard/stats', {
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

  const StatCard = ({ title, value, icon: Icon, color, shadow }: any) => (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{value || 0}</h3>
            {/* Mock trend for visual flair */}
            <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110 shadow-lg ${shadow}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs text-slate-400">
        <Activity className="w-3 h-3 mr-1" />
        <span>Live tracking active</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Supply Chain Operations</h1>
          <p className="mt-2 text-indigo-100 max-w-md">
            Manage your global inventory with real-time blockchain tracking and comprehensive analytics.
          </p>
          <button className="mt-6 bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-50 transition-colors shadow-lg shadow-indigo-500/20">
            <span>View Reports</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 translate-y-1/2 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts} 
          icon={Package} 
          color="bg-indigo-500"
          shadow="shadow-indigo-500/40"
        />
        <StatCard 
          title="In Transit" 
          value={stats?.inTransit} 
          icon={Clock} 
          color="bg-blue-500"
          shadow="shadow-blue-500/40"
        />
        <StatCard 
          title="Verified" 
          value={stats?.atRetailer} 
          icon={CheckCircle} 
          color="bg-green-500"
          shadow="shadow-green-500/40"
        />
        <StatCard 
          title="Violations" 
          value={0} 
          icon={AlertTriangle} 
          color="bg-red-500"
          shadow="shadow-red-500/40"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Mockup */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Recent Shipments</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">PROD-2025-00{i}</p>
                    <p className="text-xs text-slate-500">Scheduled for London Hub</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    In Transit
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Distribution Mockup */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-indigo-50 p-6 rounded-full">
            <TrendingUp className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Supply Efficiency</h3>
          <p className="text-sm text-slate-500">Your supply chain is operating at 94% efficiency this month.</p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[94%]"></div>
          </div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Goal: 98%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
