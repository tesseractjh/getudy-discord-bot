const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Client, Intents } = require('discord.js');
const Emoji = require('./schemas/Emoji');
const reactEmoji = require('./reactions/emoji');
const collectLink = require('./reactions/collectLink');
const linkCommands = require('./commands/link/command');
const pickCommands = require('./commands/pick/command');
const ladderCommands = require('./commands/ladder/command');
const emojiCommands = require('./commands/emoji/command');

let emojiRules = [];
const clientList = [];
const refreshEmoji = async () => {
  const json = await Emoji.find({});
  console.log('👍 Refresh emoji list')
  emojiRules = [];
  json.forEach(rule => emojiRules.push(rule));
};

const server = async () => {
  dotenv.config({ path: 'variables.env' });
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
  
  client.once('ready', () => {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, async (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('✅ Connected to database');
        refreshEmoji();
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
      await ladderCommands(message);
      await emojiCommands(message);
    } catch (err) {
      console.log(
        err,
        `오류를 일으킨 메시지: ${message.content}`,
        `오류가 일어난 시간: ${new Date().toString()}`
      );
    }
  });
  
  await client.login(process.env.TOKEN);
  clientList.push(client);
};

module.exports = {
  emojiRules, refreshEmoji, server, clientList
};