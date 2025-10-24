import { db } from './database';

export const initializeSampleData = () => {
  // Check if data already exists
  const bookings = db.getBookings();
  if (bookings.length > 0) return;

  // Add sample bookings
  const sampleBookings = [
    {
      id: '1001',
      guestName: 'Budi Santoso',
      contact: '081234567890',
      roomType: 'Deluxe',
      orderDate: '2024-01-20',
      checkIn: '2024-01-25',
      checkOut: '2024-01-27',
      status: 'paid' as const,
      totalAmount: 1500000
    },
    {
      id: '1002',
      guestName: 'Siti Nurhaliza',
      contact: '082345678901',
      roomType: 'Standard',
      orderDate: '2024-01-21',
      checkIn: '2024-01-26',
      checkOut: '2024-01-28',
      status: 'checked-in' as const,
      totalAmount: 1000000
    },
    {
      id: '1003',
      guestName: 'Ahmad Fauzi',
      contact: '083456789012',
      roomType: 'Suite',
      orderDate: '2024-01-22',
      checkIn: '2024-01-28',
      checkOut: '2024-01-30',
      status: 'pending' as const,
      totalAmount: 2400000
    },
    {
      id: '1004',
      guestName: 'Dewi Lestari',
      contact: '084567890123',
      roomType: 'Deluxe',
      orderDate: '2024-01-23',
      checkIn: '2024-01-29',
      checkOut: '2024-01-31',
      status: 'pending' as const,
      totalAmount: 1500000
    },
    {
      id: '1005',
      guestName: 'Rudi Hartono',
      contact: '085678901234',
      roomType: 'Standard',
      orderDate: '2024-01-24',
      checkIn: '2024-01-30',
      checkOut: '2024-02-01',
      status: 'paid' as const,
      totalAmount: 1000000
    }
  ];

  sampleBookings.forEach(booking => db.addBooking(booking));

  // Add sample payments
  const samplePayments = [
    {
      id: 'P001',
      bookingId: '1001',
      amount: 1500000,
      extras: [],
      totalPaid: 1500000,
      paymentDate: '2024-01-21T10:00:00'
    },
    {
      id: 'P002',
      bookingId: '1002',
      amount: 1000000,
      extras: [{name: 'Extra Bed', price: 150000}],
      totalPaid: 1150000,
      paymentDate: '2024-01-22T14:30:00'
    }
  ];

  samplePayments.forEach(payment => db.addPayment(payment));

  // Add sample transactions
  const sampleTransactions = [
    {
      id: 'T001',
      type: 'income' as const,
      category: 'Makanan',
      description: 'Penjualan breakfast untuk tamu kamar 201',
      amount: 100000,
      date: '2024-01-20T08:00:00'
    },
    {
      id: 'T002',
      type: 'expense' as const,
      category: 'Listrik',
      description: 'Pembayaran listrik bulan Januari',
      amount: 2500000,
      date: '2024-01-15T10:00:00'
    },
    {
      id: 'T003',
      type: 'income' as const,
      category: 'Laundry',
      description: 'Jasa laundry tamu',
      amount: 75000,
      date: '2024-01-22T16:00:00'
    },
    {
      id: 'T004',
      type: 'expense' as const,
      category: 'Gaji',
      description: 'Gaji karyawan bulan Januari',
      amount: 8000000,
      date: '2024-01-25T09:00:00'
    },
    {
      id: 'T005',
      type: 'expense' as const,
      category: 'Maintenance',
      description: 'Perbaikan AC kamar 305',
      amount: 500000,
      date: '2024-01-23T14:00:00'
    }
  ];

  sampleTransactions.forEach(transaction => db.addTransaction(transaction));
};