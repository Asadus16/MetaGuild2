const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ Message: "project sent" });
});

module.exports = router;
