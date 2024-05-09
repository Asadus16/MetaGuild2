const router = require("express").Router();

const {
  getTask,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", verifyToken, getTask);
router.get("/", verifyToken, getTasks);
router.post("/", createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);
// Create a task within a project (DAO member)
// Get all tasks for a specific project
// Get a specific task by ID
// Update a task status (DAO member) - This might involve updating the status field in the Task model.
// Assign a task to a user (DAO member) - This would likely involve creating a record in the join table between User and Task.
// Mark a task as complete (DAO member) - This could trigger a payment process.

module.exports = router;
