import React from 'react';
import Navbar from './Navbar';
import bg from './assets/bg.jpg';
import card from './assets/card.jpg';

const App = () => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{
      backgroundImage: `url(${bg})`,
      backgroundColor: '#f4e8e0'
    }}>
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="bg-pink-50 rounded-3xl shadow-xl p-8 md:p-12 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Satu halaman hari ini bisa mengubah ceritamu besok.
              </h1>
              
              <p className="text-gray-700 text-lg">
                Temukan, baca, dan pinjam buku favoritmu dengan mudah di LibriGo
              </p>
              
              <button className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition shadow-md">
                Pinjam Buku Sekarang
              </button>
            </div>
            
            {/* Right Image */}
            <div className="flex justify-center">
              <div className="w-full h-96 bg-gray-300 rounded-2xl shadow-lg overflow-hidden">
                <img src={card} alt="Reading book" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;