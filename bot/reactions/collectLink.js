const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { CH_REFERENCE } = require('../constants');
const Link = require('../schemas/Link');
const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = (message) => {
  if (message.channel.id.toString() !== CH_REFERENCE) return;
  const tokens = message.content
    .split('\n')
    .map(token => token.trim())
    .filter(token => token !== '');
  const links = tokens.filter(token => URL.test(token));
  links.forEach(async (link) => {
    try {
      const result = await fetch(link);
      const html = await result.text();
      const $ = await cheerio.load(html);
      const graphTitle = $("meta[property='og:title']").attr('content');
      const graphDesc = $("meta[property='og:description']").attr('content')
      if (graphTitle) tokens.push(graphTitle);
      if (graphDesc) tokens.push(graphDesc);
      const title = tokens.length > 1 ? tokens.find(token => token !== link) : tokens[0];
      const data = new Link({ title, link, keywords: tokens });
      data
        .save()
        .then(() => console.log('saved:', link))
        .catch(err => console.log(err.toString().split(/\s+/).find(word =>/Error:$/.test(word))));
    } catch (err) {
      console.log(
        __filename.split('\\').slice(-1),
        err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
      );
    }
    
  });
}