import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Clock,
  Package,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { borrowingAPI } from "../services/api";
import Swal from "sweetalert2";
import bg from "../assets/bg.jpg";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("borrowed");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestFilter, setRequestFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      loadData();
    }
  }, [isAuthenticated, user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [borrowedRes, historyRes, requestsRes] = await Promise.all([
        borrowingAPI.getMyBooks(),
        borrowingAPI.getHistory(),
        borrowingAPI.getRequests(),
      ]);

      setBorrowedBooks(borrowedRes.data.data);
      setHistory(historyRes.data.data);
      setRequests(requestsRes.data.data);
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowingId) => {
    const result = await Swal.fire({
      title: "Konfirmasi Pengembalian",
      text: "Yakin ingin mengembalikan buku ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Kembalikan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setReturningBookId(borrowingId);
      try {
        await borrowingAPI.returnBook(borrowingId);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Buku berhasil dikembalikan!",
        });
        loadData(); // Reload data
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Gagal mengembalikan buku",
        });
      } finally {
        setReturningBookId(null);
      }
    }
  };

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
        backgroundColor: "#f4e8e0",
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-3">
                Dashboard Saya
              </h1>
              <p className="text-gray-600 text-lg">
                Kelola buku yang sedang kamu pinjam
              </p>
            </div>
            <button
              onClick={() => navigate("/catalog")}
              className="group flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Ke Katalog</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Sedang Dipinjam
                  </p>
                  <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
                    {borrowedBooks.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-400/30 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-blue-100" />
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Dikembalikan
                  </p>
                  <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
                    {history.filter((h) => h.status === "returned").length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-green-400/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-100" />
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Riwayat
                  </p>
                  <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
                    {history.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-purple-400/30 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-purple-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-2xl shadow-xl mb-8 overflow-hidden border border-white/20 animate-fade-in-up delay-200">
          <div className="flex border-b border-gray-200/50">
            <button
              onClick={() => setActiveTab("borrowed")}
              className={`flex-1 px-8 py-5 font-semibold transition-all duration-300 ${
                activeTab === "borrowed"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100/80 hover:text-green-600"
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Buku Dipinjam ({borrowedBooks.length})</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-8 py-5 font-semibold transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100/80 hover:text-green-600"
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Riwayat Peminjaman</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 px-8 py-5 font-semibold transition-all duration-300 ${
                activeTab === "requests"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100/80 hover:text-green-600"
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Status Request ({requests.length})</span>
              </span>
            </button>
          </div>

          <div className="p-8">
            {/* Borrowed Books Tab */}
            {activeTab === "borrowed" && (
              <div className="animate-fade-in-up">
                {borrowedBooks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                      Belum ada buku yang dipinjam
                    </h3>
                    <p className="text-gray-500 text-lg mb-6">
                      Mulai pinjam buku dari katalog
                    </p>
                    <button
                      onClick={() => navigate("/catalog")}
                      className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Lihat Katalog</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {borrowedBooks.map((borrowing, index) => (
                      <div
                        key={borrowing.borrowing_id}
                        className="group bg-gradient-to-br from-white/95 to-gray-50/95 rounded-xl shadow-lg overflow-hidden border border-white/30 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Book Cover */}
                        <div className="relative h-48 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-6 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-700"></div>
                          {borrowing.cover_image ? (
                            <img
                              src={borrowing.cover_image}
                              alt={borrowing.title}
                              className="h-full w-auto object-contain rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
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
                          {borrowing.cover_image && (
                            <div
                              style={{ display: "none" }}
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
                            {borrowing.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            {borrowing.author}
                          </p>

                          <div className="flex items-center text-sm text-gray-500 mb-6 bg-blue-50 px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span>
                              Dipinjam:{" "}
                              {new Date(
                                borrowing.borrow_date,
                              ).toLocaleDateString("id-ID")}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              handleReturnBook(borrowing.borrowing_id)
                            }
                            disabled={
                              returningBookId === borrowing.borrowing_id
                            }
                            className="group/btn w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                          >
                            {returningBookId === borrowing.borrowing_id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                <span>Memproses...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                                <span>Kembalikan Buku</span>
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
            {activeTab === "history" && (
              <div className="animate-fade-in-up">
                {history.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Clock className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                      Belum ada riwayat peminjaman
                    </h3>
                    <p className="text-gray-500 text-lg">
                      Riwayat peminjaman akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
                      <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Buku
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Pengarang
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Tanggal Pinjam
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Tanggal Kembali
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50">
                        {history.map((item, index) => (
                          <tr
                            key={item.borrowing_id}
                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors duration-300 animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                              {item.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {item.author}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>
                                  {new Date(
                                    item.borrow_date,
                                  ).toLocaleDateString("id-ID")}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {item.return_date ? (
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>
                                    {new Date(
                                      item.return_date,
                                    ).toLocaleDateString("id-ID")}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                                  item.status === "borrowed"
                                    ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300"
                                    : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                                }`}
                              >
                                {item.status === "borrowed" ? (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    Dipinjam
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Dikembalikan
                                  </>
                                )}
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

            {/* Requests Status Tab */}
            {activeTab === "requests" && (
              <div className="animate-fade-in-up">
                {/* Filter Buttons */}
                {requests.length > 0 && (
                  <div className="mb-8 flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={() => setRequestFilter("all")}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        requestFilter === "all"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Semua ({requests.length})
                    </button>
                    <button
                      onClick={() => setRequestFilter("pending")}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        requestFilter === "pending"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Menunggu (
                      {requests.filter((r) => r.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setRequestFilter("approved")}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        requestFilter === "approved"
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Diterima (
                      {requests.filter((r) => r.status === "approved").length})
                    </button>
                    <button
                      onClick={() => setRequestFilter("rejected")}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        requestFilter === "rejected"
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Ditolak (
                      {requests.filter((r) => r.status === "rejected").length})
                    </button>
                  </div>
                )}

                {requests.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <AlertCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                      Belum ada request peminjaman
                    </h3>
                    <p className="text-gray-500 text-lg mb-6">
                      Request peminjaman Anda akan muncul di sini
                    </p>
                    <button
                      onClick={() => navigate("/catalog")}
                      className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Lihat Katalog</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                ) : (requestFilter === "all"
                    ? requests
                    : requests.filter((r) => r.status === requestFilter)
                  ).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <AlertCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                      Tidak ada request{" "}
                      {requestFilter === "pending"
                        ? "yang menunggu persetujuan"
                        : requestFilter === "approved"
                          ? "yang diterima"
                          : requestFilter === "rejected"
                            ? "yang ditolak"
                            : ""}
                    </h3>
                    <p className="text-gray-500 text-lg">
                      Tidak ada data untuk filter ini
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(requestFilter === "all"
                      ? requests
                      : requests.filter((r) => r.status === requestFilter)
                    ).map((request, index) => (
                      <div
                        key={request.request_id}
                        className="group bg-gradient-to-br from-white/95 to-gray-50/95 rounded-xl shadow-lg overflow-hidden border border-white/30 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Book Cover */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-6 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-700"></div>
                          {request.cover_image ? (
                            <img
                              src={request.cover_image}
                              alt={request.title}
                              className="h-full w-auto object-contain rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
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
                          {request.cover_image && (
                            <div
                              style={{ display: "none" }}
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
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-800 transition-colors">
                            {request.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            {request.author}
                          </p>

                          <div className="flex items-center text-sm text-gray-500 mb-6 bg-blue-50 px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span>
                              Diajukan:{" "}
                              {new Date(
                                request.request_date,
                              ).toLocaleDateString("id-ID")}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div className="w-full">
                            <span
                              className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-bold shadow-md w-full justify-center ${
                                request.status === "pending"
                                  ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                                  : request.status === "approved"
                                    ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                                    : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                              }`}
                            >
                              {request.status === "pending" ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2" />
                                  Menunggu Persetujuan
                                </>
                              ) : request.status === "approved" ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Disetujui
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Ditolak
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
