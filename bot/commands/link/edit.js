const Link = require('../../schemas/Link');
const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = (keywords, message) => {
  const [link, ...title] = keywords;
  if (!URL.test(link) || !title.length) return;
  Link
    .findOneAndUpdate({ link }, { title: title.join(' '), $push: { keywords: title.join(' ') } })
    .then(() => message.channel.send(`🤖 ${title.join(' ')}(으)로 링크 제목이 변경되었습니다. 🤖`))
    .catch(err => {
      console.log(
        __filename.split('\\').slice(-1),
        err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
      );
    });
};