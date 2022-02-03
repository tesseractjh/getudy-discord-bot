const Link = require('../../schemas/Link');

module.exports = async (message, keywords = [], options = {}) => {
  try {
    const text = keywords.map(keyword => keyword.replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9]/, (match) => '\\' + match));
    let regex = new RegExp(`${text.join('|')}`);
    if (options['포함']) {
      regex = new RegExp(text.map(word => `(?=.*${word})`).join(''));
    }
    const links = await Link.find({ keywords: { $regex: regex, $options: 'i' } }, 'link keywords');
    const output = links.map(({ link, keywords }, i) => {
      if (keywords.length < 2) {
        return `[${i + 1}] <${link}>`;
      } else {
        return `[${i + 1}] ${keywords.find(key => key !== link)}\n<${link}>`;
      }
    }).join('\n\n')
    if (output) {
      let remainedMsg = output;
      while (remainedMsg) {
        const index = remainedMsg.length > 2000 ? output.lastIndexOf('\n\n', 2000) : remainedMsg.length;
        const curMsg = remainedMsg.slice(0, index < 0 ? remainedMsg.length : index);
        await message.channel.send(curMsg);
        remainedMsg = remainedMsg.slice(curMsg.length);
      }
    }
    else message.channel.send(`🤖 "${keywords.join(' ')}"에 대한 검색결과가 없습니다. 🤖`);
  } catch (err) {
    console.log(
      __filename.split('\\').slice(-1),
      err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
    );
  }
};