import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { EmojiDispatch, LinkDispatch } from '../../pages/Home';
import Spinner from '../Spinner';
import TableHead from './TableHead';
import TableRow from './TableRow';

const TableContainer = styled.table`
  width: 100%;
`;

const Table = ({ flexArr, head, page }) => {
  let body;
  switch (page) {
    case 'link':
      body = useContext(LinkDispatch).linkData;
      break;
    case 'emoji':
      body = useContext(EmojiDispatch).emojiData;
      break;
  }
  return (
    <TableContainer>
      <TableHead flexArr={flexArr} head={head} />
      <tbody>
        {
          !body
          ? (<Spinner />)
          : body?.map((data, i) => (
            <TableRow key={data['_id']} flexArr={flexArr} data={data} index={i + 1} page={page} />
          ))
        }
      </tbody>
    </TableContainer>
  );
};

export default Table;