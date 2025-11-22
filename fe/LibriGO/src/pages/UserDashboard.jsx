import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Clock,
  Package,
} from 'lucide-react';
import { borrowingAPI } from '../services/api';
import bg from '../assets/bg.jpg';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('borrowed');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      loadData();
    }
  }, [isAuthenticated, user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [borrowedRes, historyRes] = await Promise.all([
        borrowingAPI.getMyBooks(),
        borrowingAPI.getHistory(),
      ]);

      setBorrowedBooks(borrowedRes.data.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowingId) => {
    if (
      !window.confirm('Yakin ingin mengembalikan buku ini?')
    ) {
      return;
    }

    setReturningBookId(borrowingId);
    try {
      await borrowingAPI.returnBook(borrowingId);
      alert('Buku berhasil dikembalikan!');
      loadData(); // Reload data
    } catch (error) {
      alert(
        error.response?.data?.message || 'Gagal mengembalikan buku'
      );
    } finally {
      setReturningBookId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Saya
              </h1>
              <p className="text-gray-600">
                Kelola buku yang sedang kamu pinjam
              </p>
            </div>
            <button
              onClick={() => navigate('/catalog')}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Ke Katalog</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Sedang Dipinjam</p>
                  <p className="text-3xl font-bold mt-1">
                    {borrowedBooks.length}
                  </p>
                </div>
                <BookOpen className="w-10 h-10 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Dikembalikan</p>
                  <p className="text-3xl font-bold mt-1">
                    {history.filter((h) => h.status === 'returned').length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Riwayat</p>
                  <p className="text-3xl font-bold mt-1">{history.length}</p>
                </div>
                <Package className="w-10 h-10 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'borrowed'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Buku Dipinjam ({borrowedBooks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Riwayat Peminjaman
            </button>
          </div>

          <div className="p-6">
            {/* Borrowed Books Tab */}
            {activeTab === 'borrowed' && (
              <div>
                {borrowedBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Belum ada buku yang dipinjam
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Mulai pinjam buku dari katalog
                    </p>
                    <button
                      onClick={() => navigate('/catalog')}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Lihat Katalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {borrowedBooks.map((borrowing) => (
                      <div
                        key={borrowing.borrowing_id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition"
                      >
                        {/* Book Cover */}
                        <div className="h-40 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
                          {borrowing.cover_image ? (
                            <img
                              src={borrowing.cover_image}
                              alt={borrowing.title}
                              className="h-full w-auto object-contain rounded"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <BookOpen className="w-16 h-16 mb-2" />
                              <p className="text-xs">No Cover</p>
                            </div>
                          )}
                          {borrowing.cover_image && (
                            <div
                              style={{ display: 'none' }}
                              className="flex flex-col items-center justify-center text-gray-400"
                            >
                              <BookOpen className="w-16 h-16 mb-2" />
                              <p className="text-xs">No Cover</p>
                            </div>
                          )}
                        </div>

                        {/* Book Info */}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {borrowing.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {borrowing.author}
                          </p>

                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              Dipinjam:{' '}
                              {new Date(
                                borrowing.borrow_date
                              ).toLocaleDateString('id-ID')}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              handleReturnBook(borrowing.borrowing_id)
                            }
                            disabled={
                              returningBookId === borrowing.borrowing_id
                            }
                            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {returningBookId === borrowing.borrowing_id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Memproses...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Kembalikan Buku
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Belum ada riwayat peminjaman
                    </h3>
                    <p className="text-gray-500">
                      Riwayat peminjaman akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Buku
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Pengarang
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
                        {history.map((item) => (
                          <tr key={item.borrowing_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.title}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {item.author}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {new Date(item.borrow_date).toLocaleDateString(
                                'id-ID'
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {item.return_date
                                ? new Date(item.return_date).toLocaleDateString(
                                    'id-ID'
                                  )
                                : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  item.status === 'borrowed'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {item.status === 'borrowed'
                                  ? 'Dipinjam'
                                  : 'Dikembalikan'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default UserDashboard;