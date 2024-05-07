const router = require("express").Router();
const userRoutes = require("./user");
const projectRoutes = require("./project");
const taskRoutes = require("./task");

router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);

module.exports = router;
