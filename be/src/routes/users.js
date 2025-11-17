import { Router } from "express";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const router = Router();

// GET /api/users -> list semua user
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, created_at FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
});

// GET /api/users/:id -> detail user
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
});

// POST /api/users -> tambah user
router.post("/", async (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "username dan password wajib diisi" });
  }

  try {
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, password_hash, role || "normal"]
    );
    
    const [rows] = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }
    res
      .status(500)
      .json({ message: "Gagal menambah data", error: err.message });
  }
});

// PUT /api/users/:id -> update user
router.put("/:id", async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    const [exists] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (exists.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    let password_hash = exists[0].password_hash;
    
    // Hash password baru jika diberikan
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    await pool.query(
      "UPDATE users SET username = ?, password_hash = ?, role = ? WHERE id = ?",
      [
        username ?? exists[0].username,
        password_hash,
        role ?? exists[0].role,
        req.params.id,
      ]
    );
    
    const [rows] = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }
    res
      .status(500)
      .json({ message: "Gagal memperbarui data", error: err.message });
  }
});

// DELETE /api/users/:id -> hapus user
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "Berhasil menghapus user" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: err.message });
  }
});

export default router;