const express = require("express");
const {
  getStats,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, admin, getStats);
router.get("/users", protect, admin, getUsers);
router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
