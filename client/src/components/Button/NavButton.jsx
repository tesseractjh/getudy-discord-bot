import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  background-color: ${({ checked }) => checked ? 'var(--color-orange1)' : 'var(--color-orange2)'};
  border-right: 2px solid var(--color-orange3);
  cursor: pointer;
  &:last-of-type {
    border-right: none;
  }
  &:hover {
    opacity: 0.9;
  }
`;

const NavButton = ({ page, setPage, pageName, children }) => {
  const input = useRef();
  const handleClick = useCallback(() => {
    setPage(pageName);
  }, []);
  const handleChange = useCallback(e => {
    e.target.checked = page === pageName;
  }, [page]);
  return (
    <>
      <Label htmlFor={pageName} checked={page === pageName} onClick={handleClick}>{children}</Label>
      <Input ref={input} type="radio" name="page" id={pageName} onChange={handleChange} />
    </>
  );
};

export default React.memo(NavButton);