import { useCallback } from 'react';

export const getCode = () => {
  return localStorage.getItem('getudyAuth');
};

export const auth = async () => {
  try {
    const res = await fetch(`/api/auth/${getCode()}`);
    const { result } = await res.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const customReq = (method = 'GET', body) => {
  const req = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${getCode()}`
    }
  };
  if (body) req.body = JSON.stringify(body);
  return req;
};

export const resize = ({ currentTarget }) => {
  currentTarget.style.height = 0;
  const { scrollHeight } = currentTarget;
  currentTarget.style.height = (scrollHeight ?? 0) + 'px';
};

export const findAllElements = (parent, target) => {
  const output = [];
  const findElements = (parent, target) => {
    const children = [...parent.children];
    children.forEach(child => {
      if (child.tagName.toLowerCase() === target) output.push(child.value);
      findElements(child, target);
    });
  };
  findElements(parent, target);
  return output;
};

export const getWrapper = Component => {
  let i = 0;
  return text => {
    i++;
    return (<Component key={i}>{text}</Component>);
  };
};

export const getCondition = (data, Component) => {
  const { 
    word,
    options: { 
      min = 1, 
      fixed, start, end, isExact 
    } 
  } = data;
  const wrapped = getWrapper(Component);
  let output = [];

  if (isExact) {
    const text = word.length === 1 ? '와(과) 일치' : ' 중 하나와 일치';
    output.push(...word.map(w => wrapped(w)), text);
  } else {
    if (start?.length) {
      const text = start.length === 1 ? '로 시작' : ' 중 하나로 시작';
      output.push(...start.map(word => wrapped(word)), text);
    }
  
    if (end?.length) {
      const text = end.length === 1 ? '로 끝' : ' 중 하나로 끝';
      output.push(...end.map(word => wrapped(word)), text);
    }
  
    if (fixed?.length) {
      const text = fixed.length === 1 ? '을(를) 포함' : ' 모두를 포함';
      output.push(...fixed.map(word => wrapped(word)), text)
    }
  
    if (word.length === 1) {
      if (word[0] !== '') {
        output.push(...word.map(w => wrapped(w)), ' 포함');
      }
    } else {
      output.push(...word.map(w => wrapped(w)), ` 중 ${min}개 이상 포함`);
    }
  }

  let count = 0;
  output = output
    .map((elem, i) => {
      if (typeof elem !== 'string') return elem;
      count++;
      const lastTwo = elem.slice(-2);
      if (lastTwo === ' 끝') {
        return elem + 
        (
          i === output.length - 1
            ? '남'
            : count % 2
            ? '나고, '
            : '나며, '
        );
      } else if (lastTwo === '포함') {
        return elem + 
          (
            i === output.length - 1
              ? ''
              : count % 2
              ? '하고, '
              : '하며, '
          );
      } else {
        return elem + 
          (
            i === output.length - 1
              ? '함'
              : count % 2
              ? '하고, '
              : '하며, '
          );
      }
    });

  for (let i = output.length - 2; i >= 0; i--) {
    if (typeof output[i] === 'string') continue;
    if (typeof output[i + 1] === 'string') continue;
    output.splice(i + 1, 0, ', ');
  }

  return output;
};

const getArray = string => {
  const rand = Math.random().toString().slice(2);
  const output = string
    .replace(/\\,/g, rand)
    .split(',')
    .map(elem => elem.replace(new RegExp(rand, 'g'), ','));
  return (output.length === 1 && output[0] === '') ? [] : [...new Set(output)];
};

export const getNewData = (collected, id) => {
  const isExact = !!getArray(collected[6])?.length;
  return {
    _id: id,
    word: isExact ? getArray(collected[6]) : getArray(collected[5]),
    emoji: getArray(collected[0]),
    probability: collected[7] / 100,
    options: {
      min: +collected[4],
      fixed: getArray(collected[3]),
      start: getArray(collected[1]),
      end: getArray(collected[2]),
      isExact
    }
  };
};

const isValidProbability = prob => {
  return typeof prob === 'number' && !Number.isNaN(prob) && prob > 0 && prob <= 1;
};

const isValidMin = min => {
  return Number.isInteger(min) && min > 0 && min <= 99;
};

export const isValidData = ({ word, emoji, probability, options: { min, fixed, isExact } }) => {
  if (isExact || fixed.length) {
    if (!emoji.length || probability === 0) return 'INVALID_REQ2';
    if (probability === 0 || Number.isNaN(probability)) return 'INVALID_PROB';
    if (!isExact && word.length) {
      if (!isValidMin(min)) return 'INVALID_MIN';
      if (min > word.length) return 'INVALID_MIN_VALUE';
    }
  } else {
    if (!emoji.length || !word.length || probability === 0) return 'INVALID_REQ';
    if (probability === 0 || Number.isNaN(probability)) return 'INVALID_PROB';
    if (!isValidMin(min)) return 'INVALID_MIN';
    if (min > word.length) return 'INVALID_MIN_VALUE';
  }
  return 'VALID';
};