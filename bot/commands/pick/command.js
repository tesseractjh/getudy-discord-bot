module.exports = async (message) => {
  try {
    const [command, ...keywords] = message.content.split(/\s+/);
    if (!command.startsWith('!선택')) return;
    const selected = keywords[Math.floor(Math.random() * keywords.length)];
    await message.channel.send(selected);
  } catch (err) {
    console.log(
      __filename.split('\\').slice(-1),
      err.toString().split(/\s+/).find(word =>/Error:$/.test(word))
    );
  }
};