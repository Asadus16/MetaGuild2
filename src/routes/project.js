const router = require("express").Router();

const {
  getProject,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", verifyToken, getProject);
router.get("/", verifyToken, getProjects);
router.post("/", createProject);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);
// Join a project (user) - This might involve adding a record to the join table between User and Project.

module.exports = router;
