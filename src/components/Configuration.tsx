import React, { useState } from 'react';
import { Settings, Save, X, Plus, Trash2, Home, Package } from 'lucide-react';
import { db, Room } from '../utils/database';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const { canAccessConfig } = useUser();
  const [rooms, setRooms] = useState(db.getRooms());
  const [extras, setExtras] = useState([
    { name: 'Extra Bed', price: 150000 },
    { name: 'Breakfast', price: 50000 },
    { name: 'Lunch', price: 75000 },
    { name: 'Dinner', price: 75000 }
  ]);

  if (!canAccessConfig() || !isOpen) {
    return null;
  }

  const handleRoomUpdate = (id: string, field: keyof Room, value: any) => {
    const updatedRooms = rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    );
    setRooms(updatedRooms);
  };

  const handleExtraUpdate = (index: number, field: string, value: any) => {
    const updatedExtras = [...extras];
    updatedExtras[index] = { ...updatedExtras[index], [field]: value };
    setExtras(updatedExtras);
  };

  const handleSave = () => {
    db.updateRooms(rooms);
    localStorage.setItem('extras', JSON.stringify(extras));
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Konfigurasi Sistem
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2 text-indigo-600" />
              Konfigurasi Kamar
            </h3>
            <div className="space-y-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Tipe Kamar</Label>
                      <Input
                        value={room.type}
                        onChange={(e) => handleRoomUpdate(room.id, 'type', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Jumlah</Label>
                      <Input
                        type="number"
                        value={room.quantity}
                        onChange={(e) => handleRoomUpdate(room.id, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Tersedia</Label>
                      <Input
                        type="number"
                        value={room.available}
                        onChange={(e) => handleRoomUpdate(room.id, 'available', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Harga/Malam</Label>
                      <Input
                        type="number"
                        value={room.price}
                        onChange={(e) => handleRoomUpdate(room.id, 'price', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                Item Tambahan
              </h3>
              <Button onClick={() => setExtras([...extras, { name: '', price: 0 }])} 
                className="bg-gradient-to-r from-indigo-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Item
              </Button>
            </div>
            <div className="space-y-3">
              {extras.map((extra, idx) => (
                <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Nama Item</Label>
                      <Input
                        value={extra.name}
                        onChange={(e) => handleExtraUpdate(idx, 'name', e.target.value)}
                        placeholder="Contoh: Extra Bed"
                      />
                    </div>
                    <div className="w-48">
                      <Label>Harga</Label>
                      <Input
                        type="number"
                        value={extra.price}
                        onChange={(e) => handleExtraUpdate(idx, 'price', parseFloat(e.target.value))}
                      />
                    </div>
                    <button
                      onClick={() => setExtras(extras.filter((_, i) => i !== idx))}
                      className="self-end p-2 text-red-500 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
          <Button onClick={onClose} variant="outline">
            Batal
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <Save className="w-5 h-5 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
};