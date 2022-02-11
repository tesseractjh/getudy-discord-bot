import React, { useContext, useEffect } from 'react';
import { EmojiDispatch } from '../../pages/Home';
import { customReq } from '../../util';
import SearchBar from '../SearchBar';
import Table from '../Table/Table';

const headArr = ['이모지', '조건', '확률'];
const flexArr = [3, 12, 2];

const EmojiList = () => {
  const { dispatchEmoji } = useContext(EmojiDispatch);
  useEffect(() => {
    fetch('/api/emoji', customReq())
      .then(res => res.json())
      .then(json => dispatchEmoji({ type: 'GET', json }));
  }, []);
  
  return (
    <>
      <SearchBar page="emoji" />
      <Table flexArr={flexArr} head={headArr} page="emoji" />
    </>
  );
};

export default EmojiList;