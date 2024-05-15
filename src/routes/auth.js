const router = require("express").Router();
const { authenticate } = require("../controllers/auth.js");

// const passport = require("passport");

router.post("/authenticate", authenticate);
// router.post("/token", tokenGenerator);

module.exports = router;
