import db from '../config/database.js';

export const requestBorrow = async (req, res) => {
    try {
        const { book_id } = req.body;
        const user_id = req.user.user_id;

        // Validasi input
        if (!book_id) {
            return res.status(400).json({
                success: false,
                message: 'Book ID is required'
            });
        }

        // Cek apakah buku ada
        const [books] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [book_id]
        );

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Cek status buku
        if (books[0].status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Book is not available'
            });
        }

        // Cek apakah user sudah punya request pending untuk buku ini
        const [existingRequest] = await db.query(
            'SELECT * FROM borrowing_requests WHERE user_id = ? AND book_id = ? AND status = ?',
            [user_id, book_id, 'pending']
        );

        if (existingRequest.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request for this book'
            });
        }

        // Insert request
        const [result] = await db.query(
            'INSERT INTO borrowing_requests (user_id, book_id, status) VALUES (?, ?, ?)',
            [user_id, book_id, 'pending']
        );

        res.status(201).json({
            success: true,
            message: 'Borrow request submitted successfully',
            data: {
                request_id: result.insertId,
                user_id: user_id,
                book_id: book_id,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error('RequestBorrow error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getMyBooks = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const [borrowings] = await db.query(`
            SELECT 
                br.borrowing_id,
                br.borrow_date,
                br.return_date,
                br.status,
                b.book_id,
                b.title,
                b.author,
                b.isbn,
                b.cover_image
            FROM borrowings br
            JOIN books b ON br.book_id = b.book_id
            WHERE br.user_id = ? AND br.status = 'borrowed'
            ORDER BY br.borrow_date DESC
        `, [user_id]);

        res.status(200).json({
            success: true,
            data: borrowings
        });

    } catch (error) {
        console.error('GetMyBooks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const returnBook = async (req, res) => {
    try {
        const { id } = req.params; // borrowing_id
        const user_id = req.user.user_id;

        // Cek apakah borrowing ada dan milik user ini
        const [borrowings] = await db.query(
            'SELECT * FROM borrowings WHERE borrowing_id = ? AND user_id = ? AND status = ?',
            [id, user_id, 'borrowed']
        );

        if (borrowings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Borrowing record not found or already returned'
            });
        }

        const borrowing = borrowings[0];

        // Update borrowing status
        await db.query(
            'UPDATE borrowings SET status = ?, return_date = NOW() WHERE borrowing_id = ?',
            ['returned', id]
        );

        // Update book status menjadi available
        await db.query(
            'UPDATE books SET status = ? WHERE book_id = ?',
            ['available', borrowing.book_id]
        );

        res.status(200).json({
            success: true,
            message: 'Book returned successfully'
        });

    } catch (error) {
        console.error('ReturnBook error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getMyBorrowingHistory = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const [history] = await db.query(`
            SELECT 
                br.borrowing_id,
                br.borrow_date,
                br.return_date,
                br.status,
                b.book_id,
                b.title,
                b.author,
                b.isbn,
                b.cover_image
            FROM borrowings br
            JOIN books b ON br.book_id = b.book_id
            WHERE br.user_id = ?
            ORDER BY br.borrow_date DESC
        `, [user_id]);

        res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('GetMyBorrowingHistory error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};