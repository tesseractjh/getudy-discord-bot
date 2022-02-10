const express = require('express');
const Emoji = require('../bot/schemas/Emoji');
const { refreshEmoji } = require('../botServer');

const router = express.Router();

router.get('/emoji', async (req, res) => {
  const data = await Emoji
    .find({}, 'word emoji probability options isHidden')
    .sort({ createdAt: -1 });
  res.json(data);
});

router.get('/emoji/search', async (req, res) => {
  const { keyword } = req.query;
  const keywords = keyword.trim().split(/\s+/).map(map => map.replace(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/g, '\\'));
  const regex = new RegExp(keywords.map(word => `(?=.*${word})`).join('|'));
  const data = await Emoji
    .find({
      $or: [
        { emoji: { $regex: regex, $options: 'i' } },
        { word: { $regex: regex, $options: 'i' } },
        { 'options.start': { $regex: regex, $options: 'i' } },
        { 'options.end': { $regex: regex, $options: 'i' } },
        { 'options.fixed': { $regex: regex, $options: 'i' } } 
      ]
    }, 'word emoji probability options isHidden')
    .sort({ createdAt: -1 });
  res.json(data);
});

router.post('/emoji', async (req, res) => {
  try {
    const { word, emoji, probability, options } = req.body;
    await new Emoji({ word, emoji, probability, options }).save();
    await refreshEmoji();
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
    await refreshEmoji();
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
    await refreshEmoji();
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
});

module.exports = router;