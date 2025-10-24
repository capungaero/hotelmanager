import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Plus } from 'lucide-react';
import { db } from '../utils/database';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const FinancialReport: React.FC = () => {
  const { canEdit } = useUser();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [incomeData, setIncomeData] = useState({ category: '', description: '', amount: '' });
  const [expenseData, setExpenseData] = useState({ category: '', description: '', amount: '' });
  
  const bookings = db.getBookings();
  const payments = db.getPayments();
  const transactions = db.getTransactions();

  const totalRoomRevenue = payments.reduce((sum, p) => sum + p.totalPaid, 0);
  const otherIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = totalRoomRevenue + otherIncome;
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const totalGuests = bookings.length;

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit()) return;
    db.addTransaction({
      id: Date.now().toString(),
      type: 'income',
      category: incomeData.category,
      description: incomeData.description,
      amount: parseFloat(incomeData.amount),
      date: new Date().toISOString()
    });
    setIncomeData({ category: '', description: '', amount: '' });
    setShowIncomeForm(false);
    window.location.reload();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit()) return;
    db.addTransaction({
      id: Date.now().toString(),
      type: 'expense',
      category: expenseData.category,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      date: new Date().toISOString()
    });
    setExpenseData({ category: '', description: '', amount: '' });
    setShowExpenseForm(false);
    window.location.reload();
  };

  const stats = [
    { icon: Users, label: 'Total Tamu', value: totalGuests, color: 'from-blue-400 to-blue-600' },
    { icon: TrendingUp, label: 'Total Pendapatan', value: `Rp ${totalIncome.toLocaleString('id-ID')}`, color: 'from-green-400 to-green-600' },
    { icon: TrendingDown, label: 'Total Pengeluaran', value: `Rp ${totalExpenses.toLocaleString('id-ID')}`, color: 'from-red-400 to-red-600' },
    { icon: DollarSign, label: 'Laba Bersih', value: `Rp ${netProfit.toLocaleString('id-ID')}`, color: 'from-purple-400 to-purple-600' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Laporan Keuangan
          </h1>
          <p className="text-gray-600 mt-2">Analisis pendapatan dan pengeluaran homestay</p>
        </div>
        {canEdit() && (
          <div className="flex space-x-3">
            <Button onClick={() => setShowIncomeForm(true)} className="bg-gradient-to-r from-green-500 to-green-600">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Pemasukan
            </Button>
            <Button onClick={() => setShowExpenseForm(true)} className="bg-gradient-to-r from-red-500 to-red-600">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Pengeluaran
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:transform hover:-translate-y-1">
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
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Riwayat Pemasukan
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.type === 'income').slice(-5).reverse().map(t => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm">{t.category}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                      +Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Riwayat Pengeluaran
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.type === 'expense').slice(-5).reverse().map(t => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm">{t.category}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                      -Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showIncomeForm && canEdit() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Tambah Pemasukan
            </h2>
            <form onSubmit={handleAddIncome} className="space-y-5">
              <div>
                <Label>Kategori</Label>
                <Input
                  type="text"
                  placeholder="Makanan, Laundry, dll"
                  value={incomeData.category}
                  onChange={(e) => setIncomeData({...incomeData, category: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  type="text"
                  value={incomeData.description}
                  onChange={(e) => setIncomeData({...incomeData, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  value={incomeData.amount}
                  onChange={(e) => setIncomeData({...incomeData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                  Simpan
                </Button>
                <Button type="button" onClick={() => setShowIncomeForm(false)} variant="outline" className="flex-1">
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExpenseForm && canEdit() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Tambah Pengeluaran
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <Label>Kategori</Label>
                <Input
                  type="text"
                  placeholder="Listrik, Gaji, dll"
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  type="text"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-red-500 to-red-600">
                  Simpan
                </Button>
                <Button type="button" onClick={() => setShowExpenseForm(false)} variant="outline" className="flex-1">
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};