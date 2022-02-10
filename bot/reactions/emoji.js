const dotenv = require('dotenv');
dotenv.config({ path: 'variables.env' });

const condition = (options, message, words) => {
  const { type, start, end, fixed } = options;
  let starts = start, ends = end, fixeds = fixed;
  if (typeof start === 'string') starts = [start];
  if (typeof end === 'string') ends = [end];
  if (typeof fixed === 'string') fixeds = [fixed];
  if (starts.length && !starts.some(word => message.content.startsWith(word))) return false;
  if (ends.length && !ends.some(word => message.content.endsWith(word))) return false;
  if (fixeds.length && !fixeds.every(word => message.content.includes(word))) return false;
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
    default: throw new Error('react 타입이 잘못됨');
  }
};

const getReact = (message, options) => {
  return (word, emoji, probability = 1) => {
    let words = word, emojis = emoji;
    if (typeof word === 'string') words = [word];
    if (typeof emoji === 'string') emojis = [emoji];
    if (condition(options, message, words)) {
      if (probability < Math.random()) return;
      [...emojis[Math.floor(Math.random() * emojis.length)]]
        .forEach(emoji => message.react(emoji));
    }
  };
};

const setType = (options) => {
  const { min, isExact } = options;
  let type = 'SINGLE';
  if (isExact) {
    type = 'EXACT';
  } else if (min > 1) {
    type = 'PLURAL';
  }
  options.type = type;
};

const react = (message, rule) => {
  const { word, emoji, probability, options } = rule;
  setType(options);
  getReact(message, options)(word, emoji, probability);
};

const copyEmoji = (message, probability) => {
  const isEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
  [...new Set(message.content.trim().match(isEmoji))]
    .forEach(emoji => {
      if (!/[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\x20]/g.test(emoji)) {
        if (probability >= Math.random()) {
          message.react(emoji);
        }
      }
    });
};

module.exports = (message, emojiRules) => {
  if (['!링크', '!이모지', '!선택'].some(cmd => message.content.startsWith(cmd))) return;
  copyEmoji(message, 0.1);
  emojiRules.forEach(rule => react(message, rule));
};