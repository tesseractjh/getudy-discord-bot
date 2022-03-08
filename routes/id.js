const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });
const router = express.Router();

router.get('/id', (req, res) => {
  res.json({
    NORMAL_CHANNEL: process.env.NORMAL_CHANNEL_ID
  });
});

module.exports = router;