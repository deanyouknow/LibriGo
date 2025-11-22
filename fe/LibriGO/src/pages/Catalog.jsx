import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Search, BookOpen, User, Clock } from 'lucide-react';
import { booksAPI, borrowingAPI } from '../services/api';
import bg from '../assets/bg.jpg';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, borrowed
  const [requestingBookId, setRequestingBookId] = useState(null);

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
      alert('Gagal memuat katalog buku');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBorrow = async (bookId) => {
    if (requestingBookId) return; // Prevent multiple requests

    setRequestingBookId(bookId);
    try {
      const response = await borrowingAPI.request({ book_id: bookId });
      alert('Request peminjaman berhasil! Tunggu approval dari admin.');
      loadBooks(); // Reload untuk update status
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal request peminjaman';
      alert(message);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat katalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: '#f4e8e0',
      }}
    >
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Katalog Buku
          </h1>
          <p className="text-gray-600">
            Temukan dan pinjam buku favoritmu di LibriGo
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari judul atau pengarang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="borrowed">Sedang Dipinjam</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{books.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Buku</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {books.filter((b) => b.status === 'available').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tersedia</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {books.filter((b) => b.status === 'borrowed').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Dipinjam</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {filteredBooks.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Hasil Filter</p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada buku ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.book_id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Book Cover */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="h-full w-auto object-contain rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <BookOpen className="w-20 h-20 mb-2" />
                      <p className="text-sm">No Cover</p>
                    </div>
                  )}
                  {book.cover_image && (
                    <div
                      style={{ display: 'none' }}
                      className="flex flex-col items-center justify-center text-gray-400"
                    >
                      <BookOpen className="w-20 h-20 mb-2" />
                      <p className="text-sm">No Cover</p>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <User className="w-4 h-4 mr-2" />
                    <p className="text-sm">{book.author}</p>
                  </div>

                  {book.isbn && (
                    <p className="text-xs text-gray-500 mb-3">
                      ISBN: {book.isbn}
                    </p>
                  )}

                  {book.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  {/* Status */}
                  <div className="mb-4">
                    {book.status === 'available' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Tersedia
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700 mb-2">
                          <Clock className="w-3 h-3 mr-2" />
                          Sedang Dipinjam
                        </span>
                        {book.borrowed_by && (
                          <p className="text-xs text-gray-500 mt-1">
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
                      className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {requestingBookId === book.book_id
                        ? 'Memproses...'
                        : 'Request Pinjam'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Tidak Tersedia
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;