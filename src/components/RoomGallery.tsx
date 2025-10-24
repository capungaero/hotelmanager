import React from 'react';
import { Bed, Users, Wifi, Coffee, Car, Tv } from 'lucide-react';

const roomImages = [
  {
    type: 'Standard',
    image: 'https://d64gsuwffb70l.cloudfront.net/68fb2a78b08d7db45267b143_1761290917377_e317b010.webp',
    features: ['Queen Bed', 'WiFi', 'TV', 'AC'],
    capacity: 2
  },
  {
    type: 'Deluxe',
    image: 'https://d64gsuwffb70l.cloudfront.net/68fb2a78b08d7db45267b143_1761290923978_c373f03e.webp',
    features: ['King Bed', 'WiFi', 'TV', 'AC', 'Mini Bar', 'City View'],
    capacity: 3
  },
  {
    type: 'Suite',
    image: 'https://d64gsuwffb70l.cloudfront.net/68fb2a78b08d7db45267b143_1761290936252_74606ad8.webp',
    features: ['King Bed', 'Living Room', 'WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
    capacity: 4
  }
];

export const RoomGallery: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Galeri Kamar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomImages.map((room, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img 
              src={room.image} 
              alt={room.type}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.type} Room</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">Kapasitas: {room.capacity} orang</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {room.features.map((feature, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68fb2a78b08d7db45267b143_1761290926353_b10a82db.webp" 
            alt="Deluxe Room 2"
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Deluxe Room - View 2</h3>
            <p className="text-gray-600 text-sm">Kamar luas dengan pemandangan kota yang menakjubkan</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68fb2a78b08d7db45267b143_1761290938527_b354a7e2.webp" 
            alt="Suite Room 2"
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Suite Room - Living Area</h3>
            <p className="text-gray-600 text-sm">Area ruang tamu yang nyaman dengan desain modern</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Fasilitas Homestay</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Wifi, label: 'WiFi Gratis' },
            { icon: Coffee, label: 'Breakfast' },
            { icon: Car, label: 'Parkir' },
            { icon: Tv, label: 'Smart TV' },
            { icon: Bed, label: 'Linen Bersih' },
            { icon: Users, label: '24/7 Service' }
          ].map((facility, idx) => (
            <div key={idx} className="text-center">
              <facility.icon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">{facility.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};