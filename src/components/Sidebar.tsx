import React from 'react';
import { Home, Calendar, CreditCard, FileText, Settings, LogOut, Menu, X, User, Shield, Eye } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openConfig: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen,
  openConfig 
}) => {
  const { user, logout, canAccessConfig } = useUser();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bookings', label: 'Booking', icon: Calendar },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'reports', label: 'Laporan Keuangan', icon: FileText },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'operator': return 'bg-blue-500';
      case 'readonly': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'operator': return User;
      case 'readonly': return Eye;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(user?.role || '');

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-xl"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700 text-white w-64 transform transition-transform duration-300 z-40 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            Homestay Pro
          </h2>
          
          {/* User Info */}
          <div className="mb-6 p-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getRoleBadgeColor(user?.role || '')}`}>
                <RoleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentPage === item.id 
                    ? 'bg-white text-purple-700 shadow-lg transform scale-105' 
                    : 'hover:bg-white hover:bg-opacity-20 hover:transform hover:translate-x-1'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-white border-opacity-30">
            {canAccessConfig() && (
              <button
                onClick={() => {
                  openConfig();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 hover:transform hover:translate-x-1 mb-2"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Konfigurasi</span>
              </button>
            )}
            
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin keluar?')) {
                  logout();
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500 hover:bg-opacity-80 transition-all duration-200 hover:transform hover:translate-x-1"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};