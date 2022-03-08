const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });
const router = express.Router();

router.get('/context', (req, res) => {
  res.json({
    BOT_NAME: process.env.BOT_NAME,
    NORMAL_CHANNEL_ID: process.env.NORMAL_CHANNEL_ID
  });
});

module.exports = router;