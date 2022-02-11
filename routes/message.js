const express = require('express');
const { clientList } = require('../botServer');
const router = express.Router();

router.get('/channel', (req, res) => {
  res.json(
    clientList[0].channels.cache
      .filter(({ type, guildId }) => type === 'GUILD_TEXT' && guildId === '906178551445860363')
      .map(({ name, id }) => ({ name, id }))
  );
});

router.post('/message', async (req, res) => {
  try {
    const { id, message } = req.body;
    const channel = clientList[0].channels.cache.get(id);
    await channel.send(message);
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('fail');
  }
});

module.exports = router;