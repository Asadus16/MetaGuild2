const router = require("express").Router();

const {
  getUser,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", getUser);
router.get("/me", verifyToken, getMe);
router.get("/:id", verifyToken, getUser);
router.get("/", verifyToken, getUsers);
router.post("/", createUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

// User registration
// User login (authentication)
// Get all projects a user has joined
// Get all tasks assigned to a user across all projects

module.exports = router;
