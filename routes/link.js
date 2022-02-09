const express = require('express');
const Link = require('../bot/schemas/Link');

const router = express.Router();

router.get('/link', async (req, res) => {
  const data = await Link
    .find({}, 'title link keywords')
    .sort({ createdAt: -1 });
  res.json(data);
});

router.get('/link/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const keywords = keyword.trim().split(/\s+/);
  const regex = new RegExp(keywords.map(word => `(?=.*${word})`).join(''));
  const data = await Link
    .find({ keywords: { $regex: regex, $options: 'i' }}, 'title link keywords')
    .sort({ createdAt: -1 });
  res.json(data);
});

router.put('/link', async (req, res) => {
  try {
    const { _id, title, link, keywords } = req.body;
    await Link.findOneAndUpdate({ _id }, { title, link, keywords });
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
});

router.delete('/link/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Link.findOneAndRemove({ _id: id });
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
});

module.exports = router;