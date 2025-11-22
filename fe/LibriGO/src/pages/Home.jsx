import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import bg from '../assets/bg.jpg';
import card from '../assets/card.jpg';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePinjamClick = () => {
    if (isAuthenticated) {
      navigate('/catalog');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: '#f4e8e0',
      }}
    >
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

              <button
                onClick={handlePinjamClick}
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition shadow-md"
              >
                Pinjam Buku Sekarang
              </button>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <div className="w-full h-96 bg-gray-300 rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={card}
                  alt="Reading book"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Koleksi Lengkap
            </h3>
            <p className="text-gray-600">
              Ribuan buku dari berbagai genre siap untuk dipinjam
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Proses Cepat
            </h3>
            <p className="text-gray-600">
              Request peminjaman diproses dengan cepat oleh admin
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Gratis
            </h3>
            <p className="text-gray-600">
              Semua layanan peminjaman buku gratis tanpa biaya
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;