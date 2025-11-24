# LibriGo - Library Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Express-4.18-lightgrey?style=flat-square&logo=express" alt="Express">
</div>

<p align="center">
  <strong>Sistem manajemen perpustakaan modern untuk pengelolaan peminjaman buku secara digital</strong>
</p>

---

## ✨ Fitur Utama

### 👥 User
- Registrasi dengan kode unik
- Katalog buku dengan search & filter
- Request peminjaman buku
- Pengembalian otomatis tanpa approval
- Riwayat peminjaman

### 👨‍💼 Admin
- Dashboard statistik real-time
- CRUD manajemen buku
- Approve/reject request peminjaman
- Monitoring semua peminjaman
- Manajemen user

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, Lucide Icons

**Backend:** Node.js, Express.js, MySQL, JWT, Bcrypt

---

## 📁 Struktur Project

```
librigo/
├── backend/              # Backend API (Node.js + Express)
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── README.md        # Backend documentation
│
├── frontend/            # Frontend App (React + Vite)
│   ├── src/
│   │   ├── assets/     # Images, fonts
│   │   ├── components/ # Reusable components
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── App.jsx     # Main app
│   └── README.md       # Frontend documentation
│
└── README.md           # This file
```

---

## 🚀 Instalasi

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/username/librigo.git
cd librigo

# Setup database
mysql -u root -p
CREATE DATABASE librigo;
# Import schema dari backend/README.md

# Install & Run Backend
cd backend
npm install
# Setup .env (lihat backend/README.md)
npm run dev

# Install & Run Frontend (terminal baru)
cd frontend
npm install
npm run dev
```

📖 **Dokumentasi lengkap:**
- [Backend Setup & API Documentation](be/README.md)
- [Frontend Setup](fe/README.md)

---

## ⚙️ Konfigurasi

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=librigo
JWT_SECRET=your_jwt_secret
```

### Frontend
Default: `http://localhost:5000/api`

Edit `src/services/api.js` jika perlu ubah base URL.

---

## 🎯 Cara Menjalankan

**Backend:**
```bash
cd backend
npm run dev  # Development
npm start    # Production
```
Server: `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev   # Development
npm run build # Production build
```
App: `http://localhost:3000`

---

## 👥 User Roles

### Admin
```
Username: admin
Password: admin123
```
**Access:** Full control (CRUD buku, approve request, view stats)

### User
```
Registration Code: REG2024001-REG2024005
```
**Access:** View catalog, request borrow, return books

---

## 👨‍💻 Anggota Kelompok

<table>
  <tr>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Dean&background=22c55e&color=fff&size=80" width="80px;" alt="Dean"/><br />
      <sub><b>Dean</b></sub><br />
    </td>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Thifaal&background=3b82f6&color=fff&size=80" width="80px;" alt="Thifaal"/><br />
      <sub><b>Thifaal</b></sub><br />
    </td>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Fachry&background=f59e0b&color=fff&size=80" width="80px;" alt="Fachry"/><br />
      <sub><b>Fachry</b></sub><br />
    </td>
    <td align="center">
      <img src="https://ui-avatars.com/api/?name=Ahsan&background=ec4899&color=fff&size=80" width="80px;" alt="Ahsan"/><br />
      <sub><b>Ahsan</b></sub><br />
    </td>
  </tr>
</table>

---

## 📝 Lisensi

MIT License © 2024 LibriGo Team

---

<div align="center">
  <p>Made with ❤️ by LibriGo Team</p>
</div>

---

