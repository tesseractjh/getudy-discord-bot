import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import bot from '../assets/images/bot.png';
import NavButton from '../components/Button/NavButton';
import EmojiList from '../components/List/EmojiList';
import LinkList from '../components/List/LinkList';
import Bamboo from '../components/Bamboo';
import Modal from '../components/Modal/Modal';

const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 40px 0;
`;

const HeaderImg = styled.img`
  width: 200px;
  height: 200px;
`;

const HeaderTitle = styled.h1`
  font-family: 'SUIT Variable', sans-serif;
  font-size: 40px;
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  height: 50px;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const FooterLink = styled.a`
  &:hover {
    color: var(--color-red);
  }
`;

export const HomeHeader = React.memo(({ children }) => {
  return (
    <Header>
      <HeaderImg src={bot} />
      <HeaderTitle>{children}</HeaderTitle>
    </Header>
  );
});

const linkReducer = (state, action) => {
  switch (action.type) {
    case 'GET':
      return action.json;
    default:
      return state;
  }
};

const emojiReducer = (state, action) => {
  switch (action.type) {
    case 'GET':
      return action.json;
    default:
      return state;
  }
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'WINDOW':
      return { ...state, type: action.value, window: true };
    case 'CLOSE_WINDOW':
      return { ...state, window: false };
    case 'CLOSE_ALL':
      return { ...state, window: false, register: false };
    case 'REGISTER':
      return { ...state, type: true, window: false, register: true };
    case 'SET_DATA_ID':
      return { ...state, dataId: action.value };
    default:
      return state;
  }
};

export const LinkDispatch = React.createContext(null);
export const EmojiDispatch = React.createContext(null);
export const ModalDispatch = React.createContext(null);

const Home = () => {
  const [linkData, dispatchLink] = useReducer(linkReducer);
  const [emojiData, dispatchEmoji] = useReducer(emojiReducer);
  const [modal, dispatchModal] = useReducer(modalReducer, {});
  const [page, setPage] = useState('link');

  return (
    <LinkDispatch.Provider value={{ linkData, dispatchLink }}>
      <EmojiDispatch.Provider value ={{ emojiData, dispatchEmoji }}>
        <ModalDispatch.Provider value={{ modal, dispatchModal }}>
          <Container>
            <HomeHeader>게터디봇 관리페이지</HomeHeader>
            <main>
              <Nav>
                <NavButton page={page} setPage={setPage} pageName="link">⛓️ 링크</NavButton>
                <NavButton page={page} setPage={setPage} pageName="emoji">👍 이모지</NavButton>
                <NavButton page={page} setPage={setPage} pageName="bamboo">💬 대나무봇</NavButton>
              </Nav>
              <section>
                {
                  (() => {
                    switch (page) {
                      case 'link':
                        return (<LinkList />);
                      case 'emoji':
                        return (<EmojiList />);
                      case 'bamboo':
                        return (<Bamboo />);
                      default:
                        return;
                    }
                  })()
                }
              </section>
            </main>
            <Footer>
              <small>Copyright ©
              <FooterLink href="https://github.com/tesseractjh">tesseractjh</FooterLink>. All Rights Reserved.</small>
            </Footer>
            {(modal.window || modal.register) && <Modal page={page} />}
          </Container>
        </ModalDispatch.Provider>
      </EmojiDispatch.Provider>
    </LinkDispatch.Provider>
  );
};

export default Home;