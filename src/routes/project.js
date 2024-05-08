const router = require("express").Router();

const { getProject } = require("../controllers/project");

router.get("/:id", getProject);

module.exports = router;
