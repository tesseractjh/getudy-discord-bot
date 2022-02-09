const express = require('express');
const Emoji = require('../bot/schemas/Emoji');

const router = express.Router();

router.get('/emoji', async (req, res) => {
  const data = await Emoji
    .find({}, 'word emoji probability options')
    .sort({ createdAt: -1 });
  res.json(data);
});

router.put('/emoji', async (req, res) => {
  try {
    const { _id, word, emoji, probability, options } = req.body;
    await Emoji.findOneAndUpdate({ _id }, { word, emoji, probability, options });
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
});

module.exports = router;