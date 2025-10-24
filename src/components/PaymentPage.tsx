import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, Receipt, User } from 'lucide-react';
import { db, Payment } from '../utils/database';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PaymentPage: React.FC = () => {
  const { canEdit } = useUser();
  const bookingId = window.location.hash.split('/')[1] || '';
  const booking = db.getBookings().find(b => b.id === bookingId);
  
  const [amount, setAmount] = useState(booking?.totalAmount || 0);
  const [extras, setExtras] = useState<Array<{name: string; price: number}>>([]);
  const [extraName, setExtraName] = useState('');
  const [extraPrice, setExtraPrice] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const totalAmount = amount + extras.reduce((sum, e) => sum + e.price, 0);

  const handleAddExtra = () => {
    if (!canEdit()) return;
    if (extraName && extraPrice) {
      setExtras([...extras, { name: extraName, price: parseFloat(extraPrice) }]);
      setExtraName('');
      setExtraPrice('');
    }
  };

  const handleRemoveExtra = (index: number) => {
    if (!canEdit()) return;
    setExtras(extras.filter((_, i) => i !== index));
  };

  const handlePayment = () => {
    if (!canEdit()) return;
    
    const payment: Payment = {
      id: Date.now().toString(),
      bookingId: bookingId,
      amount: amount,
      extras: extras,
      totalPaid: totalAmount,
      paymentDate: new Date().toISOString()
    };

    db.addPayment(payment);
    
    if (booking) {
      db.updateBooking(bookingId, { status: 'paid' });
    }

    // Add to transactions
    db.addTransaction({
      id: Date.now().toString(),
      type: 'income',
      category: 'Pembayaran Kamar',
      description: `Pembayaran dari ${booking?.guestName || 'Tamu'}`,
      amount: totalAmount,
      date: new Date().toISOString()
    });

    setShowSuccess(true);
    setTimeout(() => {
      window.location.hash = '#bookings';
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Pembayaran
        </h1>
        <p className="text-gray-600 mt-2">Proses pembayaran untuk reservasi kamar</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center text-2xl">
              <Receipt className="w-6 h-6 mr-3 text-purple-600" />
              Detail Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {booking && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">ID Pesanan</p>
                    <p className="font-bold text-lg mt-1">#{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Nama Tamu</p>
                    <p className="font-bold text-lg mt-1 flex items-center">
                      <User className="w-4 h-4 mr-2 text-purple-600" />
                      {booking.guestName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tipe Kamar</p>
                    <p className="font-bold text-lg mt-1">
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-purple-700 rounded-lg">
                        {booking.roomType}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Periode Menginap</p>
                    <p className="font-bold text-lg mt-1">{booking.checkIn} - {booking.checkOut}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-base font-semibold mb-3 block">
                  Jumlah Tagihan Kamar
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="text-lg h-12"
                  disabled={!canEdit()}
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Tambahan Lainnya
                </Label>
                {canEdit() && (
                  <div className="flex space-x-3 mb-4">
                    <Input
                      type="text"
                      placeholder="Nama item (Extra Bed, Makanan, dll)"
                      value={extraName}
                      onChange={(e) => setExtraName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Harga"
                      value={extraPrice}
                      onChange={(e) => setExtraPrice(e.target.value)}
                      className="w-32"
                    />
                    <Button
                      onClick={handleAddExtra}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {extras.length > 0 && (
                  <div className="space-y-3">
                    {extras.map((extra, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                        <span className="font-medium">{extra.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-lg">Rp {extra.price.toLocaleString('id-ID')}</span>
                          {canEdit() && (
                            <button
                              onClick={() => handleRemoveExtra(idx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-2 border-gray-200 mt-8 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total Pembayaran</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {canEdit() && (
                <Button
                  onClick={handlePayment}
                  className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proses Pembayaran
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Pembayaran Berhasil!
              </h3>
              <p className="text-gray-600">Mengalihkan ke halaman booking...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};