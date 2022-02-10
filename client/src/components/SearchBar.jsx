import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import SearchIcon from '../assets/images/search.svg';
import PlusIcon from '../assets/images/plus-circle-fill.svg';
import { LinkDispatch, EmojiDispatch, ModalDispatch } from '../pages/Home';

const SearchContainer = styled.form`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 10%;
  background-color: var(--color-orange1);
`;

const searchIconStyle = {
  position: 'absolute',
  left: 'calc(10% + 30px)',
  transform: 'scale(1.875)'
};

const plusIconStyle = {
  transform: 'scale(1.875)'
};

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding-left: 70px;
  background-color: var(--color-white);
  border-radius: 40px;
  font-size: 25px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 60px;
  width: 30px;
  height: 30px;
  &:hover svg {
    fill: var(--color-white);
  }
`;

const SearchInput = React.memo(({ page }) => {
  let dispatch;
  switch (page) {
    case 'link':
      dispatch = useContext(LinkDispatch).dispatchLink;
      break;
    case 'emoji':
      dispatch = useContext(EmojiDispatch).dispatchEmoji;
      break;
  }
  const [value, setValue] = useState('');
  const handleChange = useCallback(e => {
    setValue(e.target.value);
    fetch(`/api/${page}/search?keyword=${encodeURIComponent(e.target.value)}`)
      .then(res => res.json())
      .then(json => dispatch({ type: 'GET', json }));
  }, []);
  return (<Input id="search" value={value} onChange={handleChange} />);
});

const SearchBar = ({ page }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const handleRegister = useCallback(() => {
    dispatchModal({ type: 'REGISTER' });
  }, []);
  return (
    <SearchContainer>
      <SearchIcon style={searchIconStyle} />
      <label htmlFor="search" className="sr-only">검색</label>
      <SearchInput page={page} />
      {
        page === 'emoji' &&
        <Button type="button" onClick={handleRegister}>
          <PlusIcon style={plusIconStyle} />
        </Button>
      }
    </SearchContainer>
  );
};

export default SearchBar;