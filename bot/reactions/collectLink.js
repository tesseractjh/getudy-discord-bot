const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { CH_REFERENCE } = require('../constants');
const Link = require('../schemas/Link');

module.exports = (message) => {
  if (message.channel.id.toString() !== CH_REFERENCE) return;
  const tokens = message.content.split('\n').filter(token => token.trim() !== '');
  const links = tokens.filter(token => token.startsWith('http'));
  links.forEach(async (link) => {
    const result = await fetch(link);
    const html = await result.text();
    const $ = await cheerio.load(html);
    const title = $("meta[property='og:title']").attr('content');
    const desc = $("meta[property='og:description']").attr('content')
    if (title) tokens.push(title);
    if (desc) tokens.push(desc);
    const data = new Link({ link, keywords: tokens });
    data
      .save()
      .then(() => console.log('saved:', link))
      .catch(err => console.log(err.toString().split(/\s+/).find(word =>/Error:$/.test(word))));
  });
}