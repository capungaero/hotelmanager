import React, { useState } from 'react';
import { Plus, Edit2, CreditCard, Search, Calendar, User, Phone, Bed } from 'lucide-react';
import { db, Booking } from '../utils/database';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const BookingPage: React.FC = () => {
  const { canEdit } = useUser();
  const [bookings, setBookings] = useState(db.getBookings());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const rooms = db.getRooms();
  
  const [formData, setFormData] = useState({
    guestName: '',
    contact: '',
    roomType: 'Standard',
    orderDate: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit()) return;
    
    const room = rooms.find(r => r.type === formData.roomType);
    const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    
    const booking: Booking = {
      id: editingId || Date.now().toString(),
      ...formData,
      status: 'pending',
      totalAmount: (room?.price || 0) * nights
    };

    if (editingId) {
      db.updateBooking(editingId, booking);
    } else {
      db.addBooking(booking);
    }
    
    setBookings(db.getBookings());
    setShowForm(false);
    setEditingId(null);
    setFormData({
      guestName: '', contact: '', roomType: 'Standard',
      orderDate: new Date().toISOString().split('T')[0],
      checkIn: '', checkOut: ''
    });
  };

  const handleEdit = (booking: Booking) => {
    if (!canEdit()) return;
    setFormData({
      guestName: booking.guestName,
      contact: booking.contact,
      roomType: booking.roomType,
      orderDate: booking.orderDate,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut
    });
    setEditingId(booking.id);
    setShowForm(true);
  };

  const handlePayment = (bookingId: string) => {
    if (!canEdit()) return;
    window.location.hash = `#payment/${bookingId}`;
  };

  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.contact.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Manajemen Booking
          </h1>
          <p className="text-gray-600 mt-2">Kelola pemesanan kamar homestay</p>
        </div>
        {canEdit() && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Booking Baru
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari nama tamu atau kontak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {showForm && canEdit() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {editingId ? 'Edit' : 'Tambah'} Booking
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="guestName">Nama Tamu</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="guestName"
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="contact">Kontak</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="roomType">Tipe Kamar</Label>
                <div className="relative mt-1">
                  <Bed className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    id="roomType"
                    value={formData.roomType}
                    onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {rooms.map(room => (
                      <option key={room.id} value={room.type}>
                        {room.type} - Rp {room.price.toLocaleString('id-ID')}/malam
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check In</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check Out</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600">
                  {editingId ? 'Update' : 'Simpan'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {setShowForm(false); setEditingId(null);}}
                  variant="outline"
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Tamu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kontak</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kamar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check In</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check Out</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                {canEdit() && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-t hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-colors">
                  <td className="px-6 py-4 font-medium">{booking.guestName}</td>
                  <td className="px-6 py-4">{booking.contact}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                      {booking.roomType}
                    </span>
                  </td>
                  <td className="px-6 py-4">{booking.checkIn}</td>
                  <td className="px-6 py-4">{booking.checkOut}</td>
                  <td className="px-6 py-4 font-semibold">Rp {booking.totalAmount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'paid' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                      'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  {canEdit() && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePayment(booking.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};