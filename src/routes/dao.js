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
  updateDaoTask,
  isDaoAdmin,
  deleteDaoTask,
} = require("../controllers/dao");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", getDao);
router.get("/", getDaos);
router.post("/", verifyToken, createDao);
router.put("/:id", verifyToken, updateDao);
router.delete("/:id", verifyToken, deleteDao);

router.get("/:daoId/isadmin", verifyToken, isDaoAdmin);
router.get("/:daoId/members", getDaoMembers);
router.get("/:daoId/join", verifyToken, joinDao);
router.get("/:daoId/tasks", getDaoTasks);
router.post("/:daoId/task", verifyToken, createDaoTask);
router.put("/:daoId/task/:taskId", verifyToken, updateDaoTask);
router.delete("/:daoId/task/:taskId", verifyToken, deleteDaoTask);

module.exports = router;
