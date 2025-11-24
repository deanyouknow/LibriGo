import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Search, BookOpen, User, Clock, CheckCircle } from 'lucide-react';
import { booksAPI, borrowingAPI } from '../services/api';
import Swal from 'sweetalert2';
import bg from '../assets/bg.jpg';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, borrowed
  const [requestingBookId, setRequestingBookId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadBooks();
    }
  }, [isAuthenticated, navigate]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error loading books:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat katalog buku',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBorrow = async (bookId) => {
    if (requestingBookId) return; // Prevent multiple requests

    setRequestingBookId(bookId);
    try {
      const response = await borrowingAPI.request({ book_id: bookId });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Request peminjaman berhasil! Tunggu approval dari admin.',
      });
      loadBooks(); // Reload untuk update status
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal request peminjaman';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      setRequestingBookId(null);
    }
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'available' && book.status === 'available') ||
      (filterStatus === 'borrowed' && book.status === 'borrowed');

    return matchSearch && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10 animate-fade-in-up">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin-slow"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Memuat katalog...</p>
        </div>
      </div>
    );
  }

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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-3">
            Katalog Buku
          </h1>
          <p className="text-gray-600 text-lg">
            Temukan dan pinjam buku favoritmu di LibriGo
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20 animate-fade-in-up delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari judul atau pengarang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-green-300"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-green-300 appearance-none"
              >
                <option value="all">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="borrowed">Sedang Dipinjam</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">{books.length}</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Total Buku</p>
            </div>
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform">
                {books.filter((b) => b.status === 'available').length}
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Tersedia</p>
            </div>
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center border border-orange-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform">
                {books.filter((b) => b.status === 'borrowed').length}
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Dipinjam</p>
            </div>
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform">
                {filteredBooks.length}
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Hasil Filter</p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-2xl shadow-xl p-16 text-center border border-white/20 animate-fade-in-up delay-400">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Tidak ada buku ditemukan
            </h3>
            <p className="text-gray-500 text-lg">
              Coba ubah kata kunci pencarian atau filter
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up delay-400">
              {paginatedBooks.map((book, index) => (
              <div
                key={book.book_id}
                className="group bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl border border-white/30 transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Book Cover */}
                <div className="relative h-56 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-700"></div>
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="h-full w-auto object-contain rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                        <BookOpen className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-medium">No Cover</p>
                    </div>
                  )}
                  {book.cover_image && (
                    <div
                      style={{ display: 'none' }}
                      className="flex flex-col items-center justify-center text-gray-400 relative z-10"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                        <BookOpen className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-medium">No Cover</p>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-800 transition-colors">
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">{book.author}</p>
                  </div>

                  {book.isbn && (
                    <p className="text-xs text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      ISBN: {book.isbn}
                    </p>
                  )}

                  {book.description && (
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>
                  )}

                  {/* Status */}
                  <div className="mb-6">
                    {book.status === 'available' ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Tersedia
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-300 mb-3">
                          <Clock className="w-4 h-4 mr-2" />
                          Sedang Dipinjam
                        </span>
                        {book.borrowed_by && (
                          <p className="text-xs text-gray-500 bg-orange-50 px-3 py-1 rounded-full inline-block">
                            oleh {book.borrowed_by}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {book.status === 'available' ? (
                    <button
                      onClick={() => handleRequestBorrow(book.book_id)}
                      disabled={requestingBookId === book.book_id}
                      className="group/btn w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {requestingBookId === book.book_id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Memproses...</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Request Pinjam</span>
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed shadow-inner"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>Tidak Tersedia</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 mt-8 border border-white/20 animate-fade-in-up delay-600">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-medium">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;