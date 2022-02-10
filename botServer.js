const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Client, Intents } = require('discord.js');
const Emoji = require('./bot/schemas/Emoji');
const reactEmoji = require('./bot/reactions/emoji');
const collectLink = require('./bot/reactions/collectLink');
const linkCommands = require('./bot/commands/link/command');
const pickCommands = require('./bot/commands/pick/command');
const emojiCommands = require('./bot/commands/emoji/command');

const botServer = () => {
  dotenv.config({ path: 'variables.env' });
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
  const emojiRules = [];
  
  client.once('ready', () => {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, async (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('✅ Connected to database');
        const json = await Emoji.find({});
        json.forEach(rule => emojiRules.push(rule));
      }
    });
  });
  
  client.on('messageCreate', async (message) => {
    try {
      if (message.author.bot) return;
      await reactEmoji(message, emojiRules);
      await collectLink(message);
      await linkCommands(message, client);
      await pickCommands(message);
      await emojiCommands(message);
    } catch (err) {
      console.log(
        err,
        `오류를 일으킨 메시지: ${message.content}`,
        `오류가 일어난 시간: ${new Date().toString()}`
      );
    }
  });
  
  client.login(process.env.TOKEN);
};

module.exports = botServer;