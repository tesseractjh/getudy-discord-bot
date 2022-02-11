const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });

const condition = (options, message, words) => {
  const { type, start, end, fixed } = options;
  if (start.length && !start.some(word => message.content.startsWith(word))) return false;
  if (end.length && !end.some(word => message.content.endsWith(word))) return false;
  if (fixed.length && !fixed.every(word => message.content.includes(word))) return false;
  switch (type) {
    // 단어 목록(words) 중 한 개 이상 포함될 때
    case 'SINGLE':
      return words.some(word => message.content.includes(word));
    // 단어 목록 중 min개 이상 포함될 때
    case 'PLURAL': {
      const { min } = options;
      return words.filter(word => message.content.includes(word)).length >= min;
    }
    // 단어 목록 중 하나와 정확히 일치할 때
    case 'EXACT':
      return words.some(word => message.content === word);
    case 'OTHER':
      return true;
    default: throw new Error('react 타입이 잘못됨');
  }
};

const getReact = (message, options) => {
  return (word, emoji, probability = 1) => {
    if (condition(options, message, word)) {
      if (probability < Math.random()) return;
      [...emoji[Math.floor(Math.random() * emoji.length)]]
        .forEach(emj => message.react(emj));
    }
  };
};

const setType = (word, options) => {
  const { min, isExact } = options;
  let type = 'SINGLE';
  if (isExact) {
    type = 'EXACT';
  } else if (word?.length === 0) {
    type = 'OTHER';
  } else if (min > 1) {
    type = 'PLURAL';
  }
  options.type = type;
};

const react = (message, rule) => {
  const { word, emoji, probability, options } = rule;
  if (!options.type) setType(word, options);
  getReact(message, options)(word, emoji, probability);
};

const copyEmoji = async (message, probability) => {
  const isEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
  try {
    const emojis = [...new Set(message.content.trim().match(isEmoji))]
    for (const emoji of emojis) {
      if (!/[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\x20]/g.test(emoji)) {
        if (probability >= Math.random()) {
          await message.react(emoji);
        }
      }
    }
  } catch (err) {
    console.log(
      err.toString().split(/\s+/).find(word =>/Error:$/.test(word)),
      `오류를 일으킨 메시지: ${message.content}`,
      `오류가 일어난 시간: ${new Date().toString()}`
    )
  }
};

module.exports = (message, emojiRules) => {
  if (['!링크', '!이모지', '!선택'].some(cmd => message.content.startsWith(cmd))) return;
  copyEmoji(message, 0.1);
  emojiRules.forEach(rule => react(message, rule));
};