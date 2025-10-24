// SQLite-like database using localStorage
export interface Room {
  id: string;
  type: 'Standard' | 'Deluxe' | 'Suite';
  price: number;
  quantity: number;
  available: number;
}

export interface Booking {
  id: string;
  guestName: string;
  contact: string;
  roomType: string;
  orderDate: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'paid' | 'checked-in' | 'checked-out';
  totalAmount: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  extras: Array<{name: string; price: number}>;
  totalPaid: number;
  paymentDate: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}

class Database {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Initialize default data
  init() {
    if (!localStorage.getItem('rooms')) {
      this.setItem('rooms', [
        {id: '1', type: 'Standard', price: 500000, quantity: 5, available: 5},
        {id: '2', type: 'Deluxe', price: 750000, quantity: 3, available: 3},
        {id: '3', type: 'Suite', price: 1200000, quantity: 2, available: 2}
      ]);
    }
  }

  // Rooms
  getRooms(): Room[] {
    return this.getItem<Room>('rooms');
  }

  updateRooms(rooms: Room[]): void {
    this.setItem('rooms', rooms);
  }

  // Bookings
  getBookings(): Booking[] {
    return this.getItem<Booking>('bookings');
  }

  addBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.setItem('bookings', bookings);
  }

  updateBooking(id: string, booking: Partial<Booking>): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = {...bookings[index], ...booking};
      this.setItem('bookings', bookings);
    }
  }

  // Payments
  getPayments(): Payment[] {
    return this.getItem<Payment>('payments');
  }

  addPayment(payment: Payment): void {
    const payments = this.getPayments();
    payments.push(payment);
    this.setItem('payments', payments);
  }

  // Transactions
  getTransactions(): Transaction[] {
    return this.getItem<Transaction>('transactions');
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.setItem('transactions', transactions);
  }
}

export const db = new Database();
db.init();