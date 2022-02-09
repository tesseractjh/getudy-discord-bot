const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Link = require('../../schemas/Link');
const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const getCollect = (message, client) => {
  return async (channelId) => {
    let channelIds = channelId;
    if (typeof channelId === 'string') channelIds = [channelId];
    let count = 0;
    try {
      for (const channelId of channelIds) {
        const channel = client.channels.cache.get(channelId);
        message.channel.send(`🤖 ${channel.name} 채널 내 링크를 탐색하는 중입니다. 이 작업은 몇 분 정도 걸릴 수 있습니다. 🤖`);
        count += await getMessages(channel);
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

const getMessages = async (channel) => {
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
        .map(token => token.trim())
        .filter(token => token !== '' && token.slice(0, 3) !== '!링크');
      const links = tokens.filter(token => URL.test(token));
      for (const link of links) {
        const keywords = [...tokens].filter(token => token === link || !URL.test(token));
        count += await saveLink(link, keywords);
      }
    }
    if (!lastId) break;
  }
  return count;
};

const saveLink = async (link, keywords) => {
  try {
    const result = await fetch(link);
    const html = await result.text();
    const $ = cheerio.load(html);
    const graphTitle = $("meta[property='og:title']").attr('content');
    const graphDesc = $("meta[property='og:description']").attr('content')
    if (graphTitle) keywords.push(graphTitle);
    if (graphDesc) keywords.push(graphDesc);
    const title = keywords.length > 1 ? keywords.find(keyword => keyword !== link) : keywords[0];
    const data = new Link({ title, link, keywords });
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
  collect(channelIds);
};