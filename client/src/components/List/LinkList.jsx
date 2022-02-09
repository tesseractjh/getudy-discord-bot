import React, { useContext, useEffect } from 'react';
import { LinkDispatch } from '../../pages/Home';
import SearchBar from '../SearchBar';
import Table from '../Table/Table';

const headArr = ['제목'];
const flexArr = [7];

const LinkList = () => {
  const { dispatchLink } = useContext(LinkDispatch);
  useEffect(() => {
    fetch('/api/link')
      .then(res => res.json())
      .then(json => dispatchLink({ type: 'GET', json }));
  }, []);
  
  return (
    <>
      <SearchBar page="link" />
      <Table flexArr={flexArr} head={headArr} page="link" />
    </>
  );
};

export default LinkList;