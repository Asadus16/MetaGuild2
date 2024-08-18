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
  updateDaoUserRole,
  deleteDaoTask,
  getDaoAdmin,
  isDaoMember,
} = require("../controllers/dao");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", getDao);
router.get("/", getDaos);
router.post("/", verifyToken, createDao);
router.put("/:id", verifyToken, updateDao);
router.delete("/:id", verifyToken, deleteDao);

router.get("/:daoId/ismember", verifyToken, isDaoMember);
router.get("/:daoId/members", getDaoMembers);
router.get("/:daoId/admin", getDaoAdmin);
router.get("/:daoId/join", verifyToken, joinDao);
router.get("/:daoId/tasks", getDaoTasks);
router.post("/:daoId/task", verifyToken, createDaoTask);
router.put("/:daoId/task/:taskId", verifyToken, updateDaoTask);
router.put("/:daoId/user/:userId", verifyToken, updateDaoUserRole);
router.delete("/:daoId/task/:taskId", verifyToken, deleteDaoTask);

module.exports = router;
