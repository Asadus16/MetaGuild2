const router = require("express").Router();

const {
  getDao,
  getDaoMembers,
  getDaos,
  createDao,
  updateDao,
  deleteDao,
  createDaoTask,
} = require("../controllers/dao");

const { verifyToken } = require("../utils/jwt");

router.get("/:id", verifyToken, getDao);
router.get("/:daoId/members", verifyToken, getDaoMembers);
router.get("/", verifyToken, getDaos);
router.post("/", createDao);
router.put("/:id", verifyToken, updateDao);
router.delete("/:id", verifyToken, deleteDao);
// Join a Dao (user) - This might involve adding a record to the join table between User and Dao.

router.post("/:daoId/tasks", createDaoTask);

module.exports = router;
