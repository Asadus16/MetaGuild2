const router = require("express").Router();

const { getUser } = require("../controllers/user");

router.get("/:id", getUser);

module.exports = router;
