const router = require("express").Router();
const userRoutes = require("./user");
const daoRoutes = require("./dao");
const taskRoutes = require("./task");
const authRoutes = require("./auth");
const { mailSender } = require("../controllers/mailer");

router.use("/users", userRoutes);
router.use("/daos", daoRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);
router.use("/sendmail", mailSender);

module.exports = router;
