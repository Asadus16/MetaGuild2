const router = require("express").Router();

const { getTask } = require("../controllers/task");

router.get("/:id", getTask);

module.exports = router;
