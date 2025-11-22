import express from 'express';
import {
    getAllRequests,
    approveRequest,
    rejectRequest,
    getAllBorrowings,
    getDashboardStats
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/requests', verifyToken, isAdmin, getAllRequests);
router.put('/requests/:id/approve', verifyToken, isAdmin, approveRequest);
router.put('/requests/:id/reject', verifyToken, isAdmin, rejectRequest);
router.get('/borrowings', verifyToken, isAdmin, getAllBorrowings);
router.get('/stats', verifyToken, isAdmin, getDashboardStats);

export default router;