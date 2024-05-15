const router = require("express").Router();
const userRoutes = require("./user");
const daoRoutes = require("./dao");
const taskRoutes = require("./task");
const authRoutes = require("./auth");

router.use("/users", userRoutes);
router.use("/daos", daoRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);

module.exports = router;
