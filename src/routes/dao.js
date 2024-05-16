const router = require("express").Router();

const {
  getDao,
  getDaoMembers,
  getDaos,
  createDao,
  updateDao,
  deleteDao,
  getDaoTasks,
  createDaoTask,
  joinDao,
} = require("../controllers/dao");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", getDao);
router.get("/", getDaos);
router.post("/", verifyToken, createDao);
router.put("/:id", verifyToken, updateDao);
router.delete("/:id", verifyToken, deleteDao);

router.get("/:daoId/members", getDaoMembers);
router.get("/:daoId/join", verifyToken, joinDao);
router.get("/:daoId/tasks", getDaoTasks);
router.post("/:daoId/task", verifyToken, createDaoTask);

module.exports = router;
