const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });
const router = express.Router();

router.use('/auth/:code', (req, res) => {
  const { code } = req.params;
  res.json({
    result: process.env.ADMIN_KEY === code
  });
});

module.exports = router;