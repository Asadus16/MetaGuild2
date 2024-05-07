const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ Message: "task sent" });
});

module.exports = router;
