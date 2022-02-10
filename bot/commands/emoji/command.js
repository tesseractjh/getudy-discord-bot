const Emoji = require('../../schemas/Emoji');

module.exports = async (message) => {
  try {
    const [command, keywords] = [message.content.slice(0, 4), message.content.slice(5)];
    if (!command.startsWith('!이모지')) return;
    const [ word, emoji, probability = 1, options = {} ] = JSON.parse(`[${keywords.replace(/'/g, '"')}]`);
    console.log(word, emoji, probability, options);
    await new Emoji({ word, emoji, probability, options }).save();
    console.log(`registered: ${emoji}`);
  } catch (err) {
    console.log(
      __filename.split('\\').slice(-1),
      err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
    );
  }
};