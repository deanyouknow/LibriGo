import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
} from 'lucide-react';
import { booksAPI, adminAPI } from '../services/api';
import bg from '../assets/bg.jpg';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    cover_image: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/catalog');
    } else {
      loadData();
    }
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, booksRes, requestsRes, borrowingsRes] =
        await Promise.all([
          adminAPI.getStats(),
          booksAPI.getAll(),
          adminAPI.getRequests(),
          adminAPI.getBorrowings(),
        ]);

      setStats(statsRes.data.data);
      setBooks(booksRes.data.data);
      setRequests(requestsRes.data.data);
      setBorrowings(borrowingsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await booksAPI.create(bookForm);
      alert('Buku berhasil ditambahkan');
      setShowAddBookForm(false);
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        description: '',
        cover_image: '',
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menambahkan buku');
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await booksAPI.update(editingBook.book_id, bookForm);
      alert('Buku berhasil diupdate');
      setEditingBook(null);
      setShowAddBookForm(false);
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        description: '',
        cover_image: '',
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengupdate buku');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Yakin ingin menghapus buku ini?')) {
      try {
        await booksAPI.delete(bookId);
        alert('Buku berhasil dihapus');
        loadData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus buku');
      }
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await adminAPI.approveRequest(requestId);
      alert('Request berhasil diapprove');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal approve request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (window.confirm('Yakin ingin reject request ini?')) {
      try {
        await adminAPI.rejectRequest(requestId);
        alert('Request berhasil direject');
        loadData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal reject request');
      }
    }
  };

  const startEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      description: book.description || '',
      cover_image: book.cover_image || '',
    });
    setShowAddBookForm(true);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && books.length === 0) {
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
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading...</p>
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
        <div className="bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent mb-3">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Kelola buku dan peminjaman di LibriGo
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Statistik
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === 'books'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Kelola Buku
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Request Peminjaman
              {stats.pendingRequests > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('borrowings')}
              className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === 'borrowings'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Peminjaman Aktif
            </button>
          </div>

          <div className="p-6">
            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up delay-200">
                <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Buku</p>
                      <p className="text-5xl font-bold mt-3 group-hover:scale-110 transition-transform">
                        {stats.totalBooks || 0}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-blue-400/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-blue-100" />
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Buku Tersedia</p>
                      <p className="text-5xl font-bold mt-3 group-hover:scale-110 transition-transform">
                        {stats.availableBooks || 0}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-green-400/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-100" />
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Dipinjam</p>
                      <p className="text-5xl font-bold mt-3 group-hover:scale-110 transition-transform">
                        {stats.borrowedBooks || 0}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-orange-400/30 rounded-full flex items-center justify-center">
                      <Clock className="w-10 h-10 text-orange-100" />
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total User</p>
                      <p className="text-5xl font-bold mt-3 group-hover:scale-110 transition-transform">
                        {stats.totalUsers || 0}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-purple-400/30 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-purple-100" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Books Tab */}
            {activeTab === 'books' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari buku..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowAddBookForm(true);
                      setEditingBook(null);
                      setBookForm({
                        title: '',
                        author: '',
                        isbn: '',
                        description: '',
                        cover_image: '',
                      });
                    }}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Buku</span>
                  </button>
                </div>

                {/* Add/Edit Book Form */}
                {showAddBookForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}
                    </h3>
                    <form
                      onSubmit={editingBook ? handleUpdateBook : handleAddBook}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Judul Buku *
                        </label>
                        <input
                          type="text"
                          value={bookForm.title}
                          onChange={(e) =>
                            setBookForm({ ...bookForm, title: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Pengarang *
                        </label>
                        <input
                          type="text"
                          value={bookForm.author}
                          onChange={(e) =>
                            setBookForm({ ...bookForm, author: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          ISBN
                        </label>
                        <input
                          type="text"
                          value={bookForm.isbn}
                          onChange={(e) =>
                            setBookForm({ ...bookForm, isbn: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Cover Image URL
                        </label>
                        <input
                          type="text"
                          value={bookForm.cover_image}
                          onChange={(e) =>
                            setBookForm({
                              ...bookForm,
                              cover_image: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">
                          Deskripsi
                        </label>
                        <textarea
                          value={bookForm.description}
                          onChange={(e) =>
                            setBookForm({
                              ...bookForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows="3"
                        ></textarea>
                      </div>

                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          {editingBook ? 'Update Buku' : 'Tambah Buku'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddBookForm(false);
                            setEditingBook(null);
                            setBookForm({
                              title: '',
                              author: '',
                              isbn: '',
                              description: '',
                              cover_image: '',
                            });
                          }}
                          className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Books Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Judul
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Pengarang
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          ISBN
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBooks.map((book) => (
                        <tr key={book.book_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {book.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {book.author}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {book.isbn || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                book.status === 'available'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {book.status === 'available'
                                ? 'Tersedia'
                                : 'Dipinjam'}
                            </span>
                            {book.borrowed_by && (
                              <span className="block text-xs text-gray-500 mt-1">
                                oleh {book.borrowed_by}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditBook(book)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book.book_id)}
                                className="text-red-600 hover:text-red-800"
                                title="Hapus"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredBooks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      Tidak ada buku ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Buku
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tanggal Request
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request.request_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {request.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {request.title}
                          <span className="block text-xs text-gray-500">
                            by {request.author}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(request.request_date).toLocaleDateString(
                            'id-ID'
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : request.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {request.status === 'pending'
                              ? 'Pending'
                              : request.status === 'approved'
                              ? 'Approved'
                              : 'Rejected'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleApproveRequest(request.request_id)
                                }
                                className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectRequest(request.request_id)
                                }
                                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {requests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Tidak ada request peminjaman
                  </div>
                )}
              </div>
            )}

            {/* Borrowings Tab */}
            {activeTab === 'borrowings' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Buku
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tanggal Pinjam
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tanggal Kembali
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {borrowings.map((borrowing) => (
                      <tr
                        key={borrowing.borrowing_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {borrowing.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {borrowing.title}
                          <span className="block text-xs text-gray-500">
                            by {borrowing.author}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(borrowing.borrow_date).toLocaleDateString(
                            'id-ID'
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {borrowing.return_date
                            ? new Date(borrowing.return_date).toLocaleDateString(
                                'id-ID'
                              )
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              borrowing.status === 'borrowed'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {borrowing.status === 'borrowed'
                              ? 'Dipinjam'
                              : 'Dikembalikan'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {borrowings.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Tidak ada data peminjaman
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;