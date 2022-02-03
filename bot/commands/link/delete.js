const Link = require('../../schemas/Link');

module.exports = (link, message) => {
  if (!link.startsWith('http')) return;
  Link
    .deleteOne({ link })
    .then(() => message.channel.send('🤖 링크가 삭제되었습니다. 🤖'))
    .catch(err => {
      console.log(
        __filename.split('\\').slice(-1),
        err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
      );
    });
};