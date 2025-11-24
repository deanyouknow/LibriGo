import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import bg from '../assets/bg.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username dan password harus diisi');
      setLoading(false);
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      // Redirect akan otomatis lewat useEffect
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: '#f4e8e0',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="bg-gradient-to-br from-white/95 via-pink-50/95 to-purple-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-white/20 animate-fade-in-up relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-5 rounded-2xl shadow-lg animate-bounce">
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-3">
            Selamat Datang!
          </h1>
          <p className="text-gray-600 text-lg">Masuk ke akun LibriGo Anda</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up delay-200">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-green-300"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-green-300"
                placeholder="Masukkan password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors duration-200 p-1 rounded-lg hover:bg-green-50"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none animate-fade-in-up delay-400"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>Masuk</span>
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
            Belum punya akun?{' '}
            <Link
              to="/register"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 relative group"
            >
              Daftar Sekarang
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm animate-fade-in-up delay-800">
          <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Demo Login:
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-mono bg-white px-2 py-1 rounded">admin / admin123</span> (Admin)</p>
            <p><span className="font-mono bg-white px-2 py-1 rounded">wongireng / password123</span> (User)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;