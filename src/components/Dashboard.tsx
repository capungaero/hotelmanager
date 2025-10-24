import React from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Home, Bed, Clock, CheckCircle } from 'lucide-react';
import { db } from '../utils/database';
import { useUser } from '@/contexts/UserContext';

export const Dashboard: React.FC = () => {
  const { user } = useUser();
  const bookings = db.getBookings();
  const payments = db.getPayments();
  const transactions = db.getTransactions();
  
  const todayCheckIns = bookings.filter(b => 
    new Date(b.checkIn).toDateString() === new Date().toDateString()
  ).length;
  
  const currentGuests = bookings.filter(b => b.status === 'checked-in').length;
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.totalPaid, 0) +
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { icon: Users, label: 'Tamu Hari Ini', value: todayCheckIns, color: 'from-blue-400 to-blue-600' },
    { icon: Bed, label: 'Kamar Terisi', value: currentGuests, color: 'from-green-400 to-green-600' },
    { icon: DollarSign, label: 'Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, color: 'from-purple-400 to-purple-600' },
    { icon: TrendingUp, label: 'Laba Bersih', value: `Rp ${(totalRevenue - totalExpenses).toLocaleString('id-ID')}`, color: 'from-amber-400 to-amber-600' }
  ];

  const recentBookings = bookings.slice(-5).reverse();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Homestay
        </h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-600" />
            Pemesanan Terbaru
          </h2>
          <div className="space-y-3">
            {recentBookings.length > 0 ? recentBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all">
                <div>
                  <p className="font-semibold text-gray-800">{booking.guestName}</p>
                  <p className="text-sm text-gray-600 mt-1">{booking.roomType} • {booking.checkIn}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-sm ${
                  booking.status === 'paid' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                  booking.status === 'checked-in' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' :
                  'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                }`}>
                  {booking.status}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">Belum ada pemesanan</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-purple-600" />
            Status Kamar
          </h2>
          <div className="space-y-4">
            {db.getRooms().map(room => (
              <div key={room.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">{room.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Tersedia:</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    {room.available}/{room.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};