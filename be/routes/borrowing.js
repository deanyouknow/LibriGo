import express from "express";
import {
  requestBorrow,
  getMyBooks,
  returnBook,
  getMyBorrowingHistory,
  getMyRequests,
} from "../controllers/borrowingController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/request", verifyToken, requestBorrow);
router.get("/my-books", verifyToken, getMyBooks);
router.post("/return/:id", verifyToken, returnBook);
router.get("/history", verifyToken, getMyBorrowingHistory);
router.get("/my-requests", verifyToken, getMyRequests);

export default router;
