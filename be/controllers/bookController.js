import db from '../config/database.js';

export const getAllBooks = async (req, res) => {
    try {
        const [books] = await db.query(`
            SELECT 
                b.*,
                CASE 
                    WHEN br.status = 'borrowed' THEN u.username
                    ELSE NULL
                END as borrowed_by
            FROM books b
            LEFT JOIN borrowings br ON b.book_id = br.book_id AND br.status = 'borrowed'
            LEFT JOIN users u ON br.user_id = u.user_id
            ORDER BY b.created_at DESC
        `);

        res.status(200).json({
            success: true,
            data: books
        });

    } catch (error) {
        console.error('GetAllBooks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const [books] = await db.query(`
            SELECT 
                b.*,
                CASE 
                    WHEN br.status = 'borrowed' THEN u.username
                    ELSE NULL
                END as borrowed_by
            FROM books b
            LEFT JOIN borrowings br ON b.book_id = br.book_id AND br.status = 'borrowed'
            LEFT JOIN users u ON br.user_id = u.user_id
            WHERE b.book_id = ?
        `, [id]);

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: books[0]
        });

    } catch (error) {
        console.error('GetBookById error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const createBook = async (req, res) => {
    try {
        const { title, author, isbn, description, cover_image } = req.body;

        // Validasi input
        if (!title || !author) {
            return res.status(400).json({
                success: false,
                message: 'Title and author are required'
            });
        }

        // Cek ISBN duplikat jika ada
        if (isbn) {
            const [existingBook] = await db.query(
                'SELECT * FROM books WHERE isbn = ?',
                [isbn]
            );

            if (existingBook.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ISBN already exists'
                });
            }
        }

        const [result] = await db.query(
            'INSERT INTO books (title, author, isbn, description, cover_image, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, author, isbn || null, description || null, cover_image || null, 'available']
        );

        const [newBook] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: newBook[0]
        });

    } catch (error) {
        console.error('CreateBook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, isbn, description, cover_image } = req.body;

        // Cek apakah buku ada
        const [existingBook] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [id]
        );

        if (existingBook.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Cek ISBN duplikat jika diubah
        if (isbn && isbn !== existingBook[0].isbn) {
            const [duplicateISBN] = await db.query(
                'SELECT * FROM books WHERE isbn = ? AND book_id != ?',
                [isbn, id]
            );

            if (duplicateISBN.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ISBN already exists'
                });
            }
        }

        await db.query(
            'UPDATE books SET title = ?, author = ?, isbn = ?, description = ?, cover_image = ? WHERE book_id = ?',
            [
                title || existingBook[0].title,
                author || existingBook[0].author,
                isbn || existingBook[0].isbn,
                description !== undefined ? description : existingBook[0].description,
                cover_image !== undefined ? cover_image : existingBook[0].cover_image,
                id
            ]
        );

        const [updatedBook] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook[0]
        });

    } catch (error) {
        console.error('UpdateBook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah buku ada
        const [existingBook] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [id]
        );

        if (existingBook.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Cek apakah buku sedang dipinjam
        const [activeBorrowing] = await db.query(
            'SELECT * FROM borrowings WHERE book_id = ? AND status = ?',
            [id, 'borrowed']
        );

        if (activeBorrowing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete book that is currently borrowed'
            });
        }

        await db.query('DELETE FROM books WHERE book_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });

    } catch (error) {
        console.error('DeleteBook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};