const express = require('express');
const dotenv = require('dotenv');
const { clientList } = require('../bot/botServer');
const router = express.Router();

dotenv.config({ path: 'variables.env' });

router.get('/channel', (req, res) => {
  res.json(
    clientList[0].channels.cache
      .filter(({ type, guildId }) => type === 'GUILD_TEXT' && guildId === process.env.GUILD_ID)
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