import express from "express";
import pool from "../db.js";

const router = express.Router();

// ➤ Tambah buku baru
router.post("/add", async (req, res) => {
    try {
        const { nama_buku } = req.body;

        if (!nama_buku) {
            return res.status(400).json({ message: "Nama buku wajib diisi" });
        }

        const [result] = await pool.query(
            "INSERT INTO buku (nama_buku) VALUES (?)",
            [nama_buku]
        );

        res.status(201).json({
            message: "Buku berhasil ditambahkan",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// ➤ Ambil semua buku
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM buku ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// ➤ Ambil 1 buku berdasarkan ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM buku WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// ➤ Update status peminjaman (YA/TIDAK)
router.put("/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status_peminjaman } = req.body;

        if (!["YA", "TIDAK"].includes(status_peminjaman)) {
            return res.status(400).json({
                message: "Status harus 'YA' atau 'TIDAK'"
            });
        }

        await pool.query(
            "UPDATE buku SET status_peminjaman = ?, terakhir_diubah = NOW() WHERE id = ?",
            [status_peminjaman, id]
        );

        res.json({ message: "Status buku berhasil diperbarui" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// ➤ Hapus buku
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM buku WHERE id = ?", [id]);

        res.json({ message: "Buku berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

export default router;
