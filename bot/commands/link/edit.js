const Link = require('../../schemas/Link');

module.exports = (keywords, message) => {
  const [link, ...title] = keywords;
  if (!link.startsWith('http') || !title.length) return;
  Link
    .findOneAndUpdate({ link }, { $push: { keywords: { $each: [title.join(' ')], $position: 0 } } })
    .then(() => message.channel.send(`🤖 ${title.join(' ')}(으)로 링크 제목이 변경되었습니다. 🤖`))
    .catch(err => {
      console.log(
        __filename.split('\\').slice(-1),
        err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
      );
    });
};