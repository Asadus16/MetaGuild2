const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ Message: "user sent" });
});

module.exports = router;
