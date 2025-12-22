import { 
  LayoutDashboard, 
  Package, 
  Search, 
  PlusCircle, 
  TrendingUp, 
  Settings, 
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Search, label: 'Product Search', path: '/dashboard/products' },
    { icon: PlusCircle, label: 'Add Product', path: '/dashboard/products/new' },
    { icon: Package, label: 'My Inventory', path: '/dashboard/inventory' },
    { icon: TrendingUp, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-indigo-950 text-indigo-100 transition-all duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6">
          <div className={`flex items-center space-x-3 overflow-hidden ${!isOpen && 'justify-center w-full ml-0'}`}>
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg ring-4 ring-indigo-500/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">
                Tracker<span className="text-indigo-400">HQ</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center p-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600/30 text-white border-l-4 border-indigo-400' 
                  : 'hover:bg-indigo-900/50 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 bg-indigo-900/40 border-t border-indigo-800/50">
          <button
            onClick={handleLogout}
            className={`flex items-center p-3 w-full rounded-xl text-indigo-300 hover:bg-red-500/10 hover:text-red-400 transition-all group ${!isOpen && 'justify-center'}`}
          >
            <LogOut className={`w-6 h-6 transition-transform group-hover:-translate-x-1 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
