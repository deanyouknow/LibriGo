import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff, Key } from 'lucide-react';
import bg from '../assets/bg.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    registrationCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/catalog');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validasi
    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.registrationCode
    ) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.username,
      formData.password,
      formData.registrationCode
    );

    if (result.success) {
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: '#f4e8e0',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="bg-gradient-to-br from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-white/20 animate-fade-in-up relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-5 rounded-2xl shadow-lg animate-bounce">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
            Daftar Sekarang
          </h1>
          <p className="text-gray-600 text-lg">Mulai petualangan membaca Anda</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm animate-shake">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 shadow-sm animate-bounce">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up delay-200">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
              placeholder="Masukkan username"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                placeholder="Minimal 6 karakter"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                placeholder="Ulangi password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide flex items-center">
              <Key className="w-4 h-4 mr-2 text-blue-600" />
              Kode Registrasi
            </label>
            <input
              type="text"
              name="registrationCode"
              value={formData.registrationCode}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
              placeholder="Masukkan kode registrasi"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Hubungi admin untuk mendapatkan kode registrasi
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none animate-fade-in-up delay-400"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>Daftar</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up delay-600">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 relative group"
            >
              Login Sekarang
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>
        </div>

        {/* Info Kode */}
        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50 shadow-sm animate-fade-in-up delay-800">
          <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
            Kode Registrasi Demo:
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-mono bg-white px-2 py-1 rounded">2025</span></p>
            <p><span className="font-mono bg-white px-2 py-1 rounded">DAFTARUSER</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;