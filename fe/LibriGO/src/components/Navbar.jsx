import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-white/20 animate-fade-in-down">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent group-hover:from-green-800 group-hover:to-gray-900 transition-all duration-300">LibriGo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/catalog"
                  className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group"
                >
                  Katalog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>

                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-all duration-300 font-medium relative group"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ) : (
                  <Link
                    to="/user/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Hi, <span className="font-semibold text-gray-900">{user?.username}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-all duration-300 font-medium relative group"
                >
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/catalog"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-green-500 transition font-medium py-2"
                >
                  Katalog
                </Link>

                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition font-medium py-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/user/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition font-medium py-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                <div className="pt-3 border-t">
                  <p className="text-gray-600 mb-3">
                    Hi, <span className="font-semibold">{user?.username}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-green-500 transition font-medium py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;