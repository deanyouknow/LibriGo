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
    <nav className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">LibriGo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/catalog"
                  className="text-gray-700 hover:text-green-500 transition font-medium"
                >
                  Katalog
                </Link>

                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-500 transition font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/user/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-500 transition font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Hi, <span className="font-semibold">{user?.username}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
                  className="text-gray-700 hover:text-green-500 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
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