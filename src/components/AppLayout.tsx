import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { BookingPage } from './BookingPage';
import { PaymentPage } from './PaymentPage';
import { FinancialReport } from './FinancialReport';
import { ConfigModal } from './Configuration';
import { Sidebar } from './Sidebar';
import { RoomGallery } from './RoomGallery';
import LoginPage from './LoginPage';
import { initializeSampleData } from '../utils/initData';
import { useUser, UserProvider } from '@/contexts/UserContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const { user } = useUser();

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, []);
  
  // Handle hash routing for payment page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#payment/')) {
        setCurrentPage('payment');
      } else if (hash === '#bookings') {
        setCurrentPage('bookings');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <Dashboard />
            <RoomGallery />
          </>
        );
      case 'bookings':
        return <BookingPage />;
      case 'payment':
        return <PaymentPage />;
      case 'reports':
        return <FinancialReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        openConfig={() => setConfigOpen(true)}
      />
      
      <div className="lg:ml-64">
        <div className="min-h-screen">
          {renderPage()}
        </div>
      </div>

      <ConfigModal 
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
      />
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default AppLayout;