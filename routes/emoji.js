const express = require('express');
const Emoji = require('../bot/schemas/Emoji');

const router = express.Router();

router.get('/emoji', async (req, res) => {
  const data = await Emoji
    .find({}, 'word emoji probability options')
    .sort({ createdAt: -1 });
  res.json(data);
});

router.post('/emoji', async (req, res) => {
  try {
    const { word, emoji, probability, options } = req.body;
    await new Emoji({ word, emoji, probability, options }).save();
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
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

router.delete('/emoji/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Emoji.findOneAndRemove({ _id: id });
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
});

module.exports = router;