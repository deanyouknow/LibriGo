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
      className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: '#f4e8e0',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <main className="container mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="bg-gradient-to-br from-white/95 via-pink-50/95 to-purple-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto border border-white/20 animate-fade-in-up">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in-left">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent leading-tight animate-fade-in-up delay-200">
                Satu halaman hari ini bisa mengubah ceritamu besok.
              </h1>

              <p className="text-gray-700 text-lg md:text-xl animate-fade-in-up delay-400">
                Temukan, baca, dan pinjam buku favoritmu dengan mudah di LibriGo
              </p>

              <button
                onClick={handlePinjamClick}
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-600"
              >
                <span className="flex items-center space-x-2">
                  <span>Pinjam Buku Sekarang</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Right Image */}
            <div className="flex justify-center animate-fade-in-right delay-300">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative w-full h-96 bg-gradient-to-br from-white/90 to-gray-100/90 rounded-2xl shadow-2xl overflow-hidden border border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-500">
                  <img
                    src={card}
                    alt="Reading book"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in-up delay-800">
          <div className="group bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl text-center border border-white/30 transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up delay-1000">
            <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl animate-bounce">📚</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-4">
              Koleksi Lengkap
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ribuan buku dari berbagai genre siap untuk dipinjam
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl text-center border border-white/30 transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up delay-1200">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl animate-pulse">⚡</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
              Proses Cepat
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Request peminjaman diproses dengan cepat oleh admin
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl text-center border border-white/30 transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up delay-1400">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl animate-spin-slow">💯</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-4">
              Gratis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Semua layanan peminjaman buku gratis tanpa biaya
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;