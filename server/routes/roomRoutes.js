const express = require("express");
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const {
  createRoomReview,
  getRoomReviews,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", protect, admin, upload.array("images", 8), createRoom);
router.put("/:id", protect, admin, upload.array("images", 8), updateRoom);
router.delete("/:id", protect, admin, deleteRoom);

// Review routes
router.route("/:id/reviews").post(protect, createRoomReview).get(getRoomReviews);

module.exports = router;

