const searchLinks = require('./search');
const editLink = require('./edit');
const deleteLink = require('./delete');
const collectAllLinks = require('./collectAll');

module.exports = async (message, client) => {
  const [command, ...keywords] = message.content.split(/\s+/);
  if (!command.startsWith('!링크')) return;
  let options = {};
  if (command[3] === ':') {
    command
      .slice(4)
      .split(',')
      .forEach(option => options[option.slice(0, 2)] = option.slice(2) ? option.slice(2) : true);
  }
  if (options['등록']) {
    if (typeof options['등록'] !== 'string') return;
    const channelIds = options['등록'].split(',');
    collectAllLinks(message, client, channelIds);
  } else if (options['수정']) {
    editLink(keywords, message);
  } else if (options['삭제']) {
    deleteLink(keywords[0], message);
  } else if (options['모두']) {
    searchLinks(message);
  } else if (keywords.length) {
    searchLinks(message, keywords, options);
  }
};