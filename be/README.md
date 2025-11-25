# Backend - LibriGo API

RESTful API untuk sistem manajemen perpustakaan LibriGo menggunakan Node.js, Express, dan MySQL.

## 🚀 Instalasi

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database

**Buat Database:**
```sql
CREATE DATABASE librigo;
USE librigo;
```

**Import Schema:**
```sql
-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    cover_image VARCHAR(255),
    status ENUM('available', 'borrowed') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Borrowing requests table
CREATE TABLE borrowing_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

-- Borrowings table
CREATE TABLE borrowings (
    borrowing_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

-- Registration codes table
CREATE TABLE registration_codes (
    code_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (used_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Insert default admin (password: admin123)
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin');

-- Insert registration codes
INSERT INTO registration_codes (code) VALUES 
('2025'), ('DAFTARUSER'), ('ngopi');

-- Insert sample books
INSERT INTO books (title, author, isbn, description, status) VALUES 
('Laskar Pelangi', 'Andrea Hirata', '9780000000001', 'Novel tentang perjuangan anak-anak Belitung', 'available'),
('Bumi Manusia', 'Pramoedya Ananta Toer', '9780000000002', 'Tetralogi Buru pertama', 'available'),
('Filosofi Kopi', 'Dee Lestari', '9780000000003', 'Kumpulan cerpen tentang kopi dan kehidupan', 'available');

-- Create indexes
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_book_status ON books(status);
CREATE INDEX idx_borrowing_status ON borrowings(status);
CREATE INDEX idx_request_status ON borrowing_requests(status);
```

### 3. Hash Password untuk Admin

Jalankan script ini untuk generate hashed password:
```javascript
// hashPassword.js
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10).then(hash => console.log(hash));
```

---

## ⚙️ Konfigurasi

Buat file `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=librigo
JWT_SECRET=your_super_secret_jwt_key
```

---

## 🎯 Cara Menjalankan

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server berjalan di: `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123",
  "registrationCode": "2025"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "user_id": 1, "username": "admin", "role": "admin" }
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

### Books

#### Get All Books
```http
GET /books
Authorization: Bearer {token}
```

#### Get Book by ID
```http
GET /books/:id
Authorization: Bearer {token}
```

#### Create Book (Admin)
```http
POST /books
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "description": "A Handbook of Agile Software Craftsmanship"
}
```

#### Update Book (Admin)
```http
PUT /books/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Book (Admin)
```http
DELETE /books/:id
Authorization: Bearer {admin_token}
```

---

### Borrowing

#### Request Borrow
```http
POST /borrowing/request
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "book_id": 1
}
```

#### Get My Borrowed Books
```http
GET /borrowing/my-books
Authorization: Bearer {user_token}
```

#### Return Book
```http
POST /borrowing/return/:borrowing_id
Authorization: Bearer {user_token}
```

#### Get Borrowing History
```http
GET /borrowing/history
Authorization: Bearer {user_token}
```

---

### Admin

#### Get All Requests
```http
GET /admin/requests
Authorization: Bearer {admin_token}
```

#### Approve Request
```http
PUT /admin/requests/:id/approve
Authorization: Bearer {admin_token}
```

#### Reject Request
```http
PUT /admin/requests/:id/reject
Authorization: Bearer {admin_token}
```

#### Get All Borrowings
```http
GET /admin/borrowings
Authorization: Bearer {admin_token}
```

#### Get Dashboard Stats
```http
GET /admin/stats
Authorization: Bearer {admin_token}
```

---

## 🧪 Testing API

### Menggunakan Postman

**1. Login Admin:**
```
POST http://localhost:3000/api/auth/login
Body: { "username": "admin", "password": "admin123" }
```
Copy token dari response.

**2. Get Books:**
```
GET http://localhost:3000/api/books
Headers: Authorization: Bearer {token}
```

**3. Create Book:**
```
POST http://localhost:3000/api/books
Headers: Authorization: Bearer {admin_token}
Body: {
  "title": "New Book",
  "author": "Author Name"
}
```

### Menggunakan cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Books
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Book
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author"}'
```

---

## 🗄️ Database Schema

### ERD
```
users (1) ──── (N) borrowing_requests (N) ──── (1) books
  │                                              │
  │                                              │
  └──────────── (N) borrowings (N) ──────────────┘
```

### Tables

**users:** user_id, username, password, role, created_at

**books:** book_id, title, author, isbn, description, cover_image, status, created_at, updated_at

**borrowing_requests:** request_id, user_id, book_id, request_date, status

**borrowings:** borrowing_id, user_id, book_id, borrow_date, return_date, status

**registration_codes:** code_id, code, is_used, used_by, created_at

---

## 📝 Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | librigo |
| JWT_SECRET | JWT secret key | - |

---

<div align="center">
  <p>Backend API © 2024 LibriGo Team</p>
</div>

---
