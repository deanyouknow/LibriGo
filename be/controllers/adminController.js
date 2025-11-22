import db from '../config/database.js';

export const getAllRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT 
                req.request_id,
                req.request_date,
                req.status,
                u.user_id,
                u.username,
                b.book_id,
                b.title,
                b.author,
                b.isbn,
                b.cover_image
            FROM borrowing_requests req
            JOIN users u ON req.user_id = u.user_id
            JOIN books b ON req.book_id = b.book_id
            ORDER BY 
                CASE 
                    WHEN req.status = 'pending' THEN 1
                    WHEN req.status = 'approved' THEN 2
                    WHEN req.status = 'rejected' THEN 3
                END,
                req.request_date DESC
        `);

        res.status(200).json({
            success: true,
            data: requests
        });

    } catch (error) {
        console.error('GetAllRequests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah request ada dan statusnya pending
        const [requests] = await db.query(
            'SELECT * FROM borrowing_requests WHERE request_id = ? AND status = ?',
            [id, 'pending']
        );

        if (requests.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found or already processed'
            });
        }

        const request = requests[0];

        // Cek apakah buku masih available
        const [books] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [request.book_id]
        );

        if (books.length === 0 || books[0].status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Book is no longer available'
            });
        }

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            // Update request status
            await db.query(
                'UPDATE borrowing_requests SET status = ? WHERE request_id = ?',
                ['approved', id]
            );

            // Insert ke borrowings table
            await db.query(
                'INSERT INTO borrowings (user_id, book_id, status) VALUES (?, ?, ?)',
                [request.user_id, request.book_id, 'borrowed']
            );

            // Update book status
            await db.query(
                'UPDATE books SET status = ? WHERE book_id = ?',
                ['borrowed', request.book_id]
            );

            await db.query('COMMIT');

            res.status(200).json({
                success: true,
                message: 'Request approved successfully'
            });

        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }

    } catch (error) {
        console.error('ApproveRequest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah request ada dan statusnya pending
        const [requests] = await db.query(
            'SELECT * FROM borrowing_requests WHERE request_id = ? AND status = ?',
            [id, 'pending']
        );

        if (requests.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found or already processed'
            });
        }

        // Update request status
        await db.query(
            'UPDATE borrowing_requests SET status = ? WHERE request_id = ?',
            ['rejected', id]
        );

        res.status(200).json({
            success: true,
            message: 'Request rejected successfully'
        });

    } catch (error) {
        console.error('RejectRequest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getAllBorrowings = async (req, res) => {
    try {
        const [borrowings] = await db.query(`
            SELECT 
                br.borrowing_id,
                br.borrow_date,
                br.return_date,
                br.status,
                u.user_id,
                u.username,
                b.book_id,
                b.title,
                b.author,
                b.isbn,
                b.cover_image
            FROM borrowings br
            JOIN users u ON br.user_id = u.user_id
            JOIN books b ON br.book_id = b.book_id
            ORDER BY 
                CASE 
                    WHEN br.status = 'borrowed' THEN 1
                    WHEN br.status = 'returned' THEN 2
                END,
                br.borrow_date DESC
        `);

        res.status(200).json({
            success: true,
            data: borrowings
        });

    } catch (error) {
        console.error('GetAllBorrowings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // Total books
        const [totalBooks] = await db.query('SELECT COUNT(*) as count FROM books');
        
        // Available books
        const [availableBooks] = await db.query(
            'SELECT COUNT(*) as count FROM books WHERE status = ?',
            ['available']
        );
        
        // Borrowed books
        const [borrowedBooks] = await db.query(
            'SELECT COUNT(*) as count FROM books WHERE status = ?',
            ['borrowed']
        );
        
        // Total users
        const [totalUsers] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['user']
        );
        
        // Pending requests
        const [pendingRequests] = await db.query(
            'SELECT COUNT(*) as count FROM borrowing_requests WHERE status = ?',
            ['pending']
        );

        res.status(200).json({
            success: true,
            data: {
                totalBooks: totalBooks[0].count,
                availableBooks: availableBooks[0].count,
                borrowedBooks: borrowedBooks[0].count,
                totalUsers: totalUsers[0].count,
                pendingRequests: pendingRequests[0].count
            }
        });

    } catch (error) {
        console.error('GetDashboardStats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};