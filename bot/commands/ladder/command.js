const getLadder = require('./random');

module.exports = async (message) => {
  try {
    const [command, keywords] = message.content.split(/\s+/);
    if (!command.startsWith('!사다리')) return;
    switch (command.slice(5)) {
      case '포함':
        await message.channel.send(await getLadder('INCLUDE', keywords));
        break;
      case '제외':
        await message.channel.send(await getLadder('EXCLUDE', keywords));
        break;
      default:
        await message.channel.send(await getLadder('ALL'));
    }
  } catch (err) {
    console.log(
      err,
      __filename.split('\\').slice(-1),
      err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
    );
  }
};