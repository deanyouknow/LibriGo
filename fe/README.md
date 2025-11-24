# Frontend - LibriGo

React application untuk sistem manajemen perpustakaan LibriGo menggunakan Vite, React Router, dan Tailwind CSS.

## 🚀 Instalasi

```bash
cd frontend
npm install
```

### Dependencies
- React 18.2
- React Router DOM 6
- Axios
- Tailwind CSS 3.3
- Lucide React (Icons)
- Vite

---

## ⚙️ Konfigurasi

### API Base URL

Default: `http://localhost:5000/api`

Edit `src/services/api.js` jika backend berjalan di URL lain:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Ubah sesuai kebutuhan
```

### Environment Variables (Optional)

Buat `.env` jika perlu:
```env
VITE_API_URL=http://localhost:5000/api
```

Update `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 🎯 Cara Menjalankan

### Development Mode
```bash
npm run dev
```
App berjalan di: `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 📁 Struktur Folder

```
src/
├── assets/              # Images, fonts
│   ├── bg.jpg
│   └── card.jpg
├── components/          # Reusable components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/             # React Context
│   └── AuthContext.jsx  # Authentication state
├── pages/               # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Catalog.jsx
│   ├── UserDashboard.jsx
│   └── AdminDashboard.jsx
├── services/            # API services
│   └── api.js           # Axios instance
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

---

## 🎨 Pages

### Public Pages
- **Home** (`/`) - Landing page dengan hero section
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration dengan kode unik

### Protected Pages (User)
- **Catalog** (`/catalog`) - Browse dan search buku
- **User Dashboard** (`/user/dashboard`) - Manage peminjaman

### Protected Pages (Admin)
- **Admin Dashboard** (`/admin/dashboard`) - Full management system

---

## 🔐 Authentication

### Login Flow
```javascript
// Login
const { login } = useAuth();
const result = await login(username, password);

if (result.success) {
  // Auto redirect based on role:
  // - Admin → /admin/dashboard
  // - User → /catalog
}
```

### Protected Routes
```javascript
// User route
<ProtectedRoute>
  <Catalog />
</ProtectedRoute>

// Admin only route
<ProtectedRoute adminOnly={true}>
  <AdminDashboard />
</ProtectedRoute>
```

### Logout
```javascript
const { logout } = useAuth();
logout(); // Clears token and redirects to home
```

---

## 🌐 API Integration

### Example Usage

```javascript
import { booksAPI, borrowingAPI, adminAPI } from '../services/api';

// Get all books
const response = await booksAPI.getAll();
const books = response.data.data;

// Request borrow
await borrowingAPI.request({ book_id: 1 });

// Admin: Approve request
await adminAPI.approveRequest(requestId);
```

### Available API Methods

**Auth:**
- `authAPI.register(data)`
- `authAPI.login(data)`
- `authAPI.getMe()`

**Books:**
- `booksAPI.getAll()`
- `booksAPI.getById(id)`
- `booksAPI.create(data)` (Admin)
- `booksAPI.update(id, data)` (Admin)
- `booksAPI.delete(id)` (Admin)

**Borrowing:**
- `borrowingAPI.request(data)`
- `borrowingAPI.getMyBooks()`
- `borrowingAPI.returnBook(id)`
- `borrowingAPI.getHistory()`

**Admin:**
- `adminAPI.getRequests()`
- `adminAPI.approveRequest(id)`
- `adminAPI.rejectRequest(id)`
- `adminAPI.getBorrowings()`
- `adminAPI.getStats()`

---

## 🎨 Styling

### Tailwind CSS

Customization di `tailwind.config.js`:
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'pink': { 50: '#fdf2f8' }
      }
    },
  },
}
```

### Global Styles

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
```

---

## 📱 Responsive Design

Aplikasi fully responsive dengan breakpoints:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

Contoh penggunaan:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

---

## 🚨 Error Handling

```javascript
try {
  const response = await booksAPI.getAll();
  setBooks(response.data.data);
} catch (error) {
  const message = error.response?.data?.message || 'Terjadi kesalahan';
  alert(message);
}
```

---

## 🔄 State Management

### Auth Context
```javascript
const { user, isAuthenticated, isAdmin, login, logout } = useAuth();

// Check authentication
if (!isAuthenticated) {
  navigate('/login');
}

// Check admin role
if (isAdmin) {
  // Show admin features
}
```

---

## 📝 Scripts

```json
{
  "dev": "vite",              // Development server
  "build": "vite build",      // Production build
  "preview": "vite preview",  // Preview production build
  "lint": "eslint ."          // Lint code
}
```

---

## 🎯 Features

### User Features
- ✅ Browse katalog dengan search & filter
- ✅ Request peminjaman buku
- ✅ View & manage borrowed books
- ✅ Return books
- ✅ View borrowing history

### Admin Features
- ✅ Dashboard dengan statistik
- ✅ CRUD manajemen buku
- ✅ Approve/reject borrow requests
- ✅ Monitor all borrowings
- ✅ Search & filter buku

---

## 🎨 UI Components

### Navbar
- Responsive navigation
- Dynamic menu berdasarkan auth status
- Mobile menu dengan hamburger icon

### ProtectedRoute
- Route protection berdasarkan authentication
- Role-based access control
- Auto redirect untuk unauthorized access

### Loading States
- Skeleton loaders
- Spinner animations
- Disabled buttons saat loading

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Ubah port di vite.config.js
server: {
  port: 3001, // Ubah dari 3000
}
```

### CORS Error
Pastikan backend CORS sudah configured untuk `http://localhost:3000`

### Build Errors
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

<div align="center">
  <p>Frontend App © 2024 LibriGo Team</p>
</div>
