const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Link = require('../../schemas/Link');

const getCollect = (message, client) => {
  return async (channelId, word) => {
    let channelIds = channelId;
    if (typeof channelId === 'string') channelIds = [channelId];
    let count = 0;
    try {
      for (const channelId of channelIds) {
        const channel = client.channels.cache.get(channelId);
        count += await getMessages(channel, word);
      }
      message.channel.send(`🤖 ${count}개의 링크가 등록되었습니다. 🤖`);
    } catch (err) {
      console.log(
        __filename.split('\\').slice(-1),
        err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
      );
    }
  };
};

const getMessages = async (channel, word) => {
  let lastId = null;
  let limit = 100;
  let count = 0;
  while (true) {
    const options = { limit };
    if (lastId) options.before = lastId;
    const messages = await channel.messages.fetch(options);
    lastId = messages?.last()?.id;
    const msgs = messages.filter(msg => !msg.author.bot);
    for (const msg of msgs) {
      const tokens = msg[1].content
        .split('\n')
        .filter(token => token.trim() !== '' && token.slice(0, 3) !== '!링크');
      const { keyword, method } = word;
      const links = tokens.filter(token => token[method](keyword));
      for (const link of links) {
        count += await saveLink(link, [...tokens].filter(token => token === link || !token.startsWith('http')));
      }
    }
    if (!lastId) break;
  }
  return count;
};

const saveLink = async (link, tokens) => {
  try {
    const result = await fetch(link);
    const html = await result.text();
    const $ = cheerio.load(html);
    const title = $("meta[property='og:title']").attr('content');
    const desc = $("meta[property='og:description']").attr('content')
    if (title) tokens.push(title);
    if (desc) tokens.push(desc);
    const data = new Link({ link, keywords: tokens });
    await data.save();
    console.log('saved:', link);
    return 1;
  } catch (err) {
    console.log(
      __filename.split('\\').slice(-1),
      err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
    );
    return 0;
  }
};
  
module.exports = (message, client, channelIds) => {
  const collect = getCollect(message, client);
  collect(channelIds, { keyword: 'http', method: 'startsWith' });
};