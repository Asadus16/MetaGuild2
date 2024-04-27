const router = require('express').Router();

router.get('/me', (req, res) => {
  res.json({ Message: ' user sent' });
});

module.exports = router;
