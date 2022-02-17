const MEMBERS = process.env.MEMBERS.split('.');

const getShuffledMembers = (include = [], exclude = []) => {
  let members;
  if (include.length) {
    members = include.map(key => MEMBERS.find(member => member.startsWith(key)));
  } else if (exclude.length) {
    members = [...MEMBERS];
    exclude.forEach(key => members.splice(members.findIndex(member => member.startsWith(key)), 1));
  } else {
    members = [...MEMBERS];
  }
  for (let i = 0; i < members.length; i++) {
    const rand = Math.floor(Math.random() * members.length);
    const temp = members[rand];
    members[rand] = members[i];
    members[i] = temp;
  }
  return members.map((v, i) => `[${i + 1}] ${v}`).join('\n');
};

const getLadder = async (type, condition) => {
  switch (type) {
    case 'ALL':
      return getShuffledMembers();
    case 'INCLUDE':
      return getShuffledMembers([...condition]);
    case 'EXCLUDE':
      return getShuffledMembers([], [...condition]);
    default: return '🤖 잘못된 명령어입니다! 🤖';
  }
};

module.exports = getLadder;