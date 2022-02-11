import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { LinkDispatch, EmojiDispatch, ModalDispatch } from '../../pages/Home';
import Spinner from '../Spinner';
import { customReq } from '../../util';
import EmojiInfo from '../Info/EmojiInfo';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-black-alpha);
`;

const Window = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  background-color: var(--color-white);
  font-family: 'SUIT Variable', sans-serif;
  font-size: 20px;
`;

const Content = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  padding: 0 30px;
  line-height: 30px;
`;

const ButtonList = styled.ul`
  display: flex;
  width: 100%;
`;

const ButtonItem = styled.li`
  flex: 1;
  display: flex;
  height: 50px;
  & button {
    flex: 1;
  }
`;

const NoButton = styled.button`
  background-color: var(--color-gray4);
  font-size: 20px;
  color: var(--color-black);
  &:hover {
    opacity: 0.9;
  }
`;

const YesButton = styled.button`
  background-color: var(--color-red);
  font-size: 20px;
  color: var(--color-white);
  &:hover {
    opacity: 0.9;
  }
`;

const spinnerStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

const ModalWindow = ({ confirm, closeModal, dataId, page, children }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const deleteData = useCallback(async () => {
    dispatchModal({ type: 'WINDOW', value: 'SPINNER' });
    const res = await fetch(`/api/${page}/${dataId}`, customReq('DELETE'));
    const result = await res.text();
    if (result === 'success') {
      dispatchModal({ type: 'WINDOW', value: 'SUCCESS' });
    } else {
      dispatchModal({ type: 'WINDOW', value: 'FAIL' });
    }
  }, []);
  
  return (
    <>
      <Window>
        <Content>{children}</Content>
        <ButtonList>
          {
            confirm &&
            <ButtonItem>
              <NoButton onClick={closeModal}>아니오</NoButton>
            </ButtonItem>
          }
          <ButtonItem>
            <YesButton onClick={confirm ? deleteData : closeModal}>
              {confirm ? '예' : '확인'}
            </YesButton>
          </ButtonItem>
        </ButtonList>
      </Window>
    </>
  );
};

const Modal = ({ page }) => {
  let dispatch;
  switch (page) {
    case 'link':
      dispatch = useContext(LinkDispatch).dispatchLink;
      break;
    case 'emoji':
      dispatch = useContext(EmojiDispatch).dispatchEmoji;
      break;
  }
  const { modal: { type, window, dataId, register }, dispatchModal } = useContext(ModalDispatch);
  const closeAllModal = useCallback(() =>  {
    dispatchModal({ type: 'CLOSE_ALL' });
  }, []);
  const closeModal = useCallback(() => {
    dispatchModal({ type: 'CLOSE_WINDOW' });
  }, []);
  const refreshModal = useCallback(() => {
    dispatchModal({ type: 'CLOSE_ALL' });
    fetch(`/api/${page}`, customReq())
      .then(res => res.json())
      .then(json => dispatch({ type: 'GET', json }));
  }, []);
  return (
    <>
      {
        register && 
        <>
          <Background onClick={closeAllModal} />
          <EmojiInfo data={{ _id: dataId }} isRegister />
        </>
      }
      {
        window && <Background onClick={closeAllModal} />
      }
      { window &&
        (() => {
          switch (type) {
            case 'DELETE': 
              return <ModalWindow closeModal={closeModal} dataId={dataId} page={page} confirm>정말로 삭제하시겠습니까?</ModalWindow>;
            case 'INVALID_REQ':
              return <ModalWindow closeModal={closeModal}>이모지, 확률, 그리고 나머지 중 최소 1개 이상은 반드시 입력해야 합니다!</ModalWindow>;
            case 'INVALID_REQ2':
              return <ModalWindow closeModal={closeModal}>이모지, 확률은 반드시 입력해야 합니다!</ModalWindow>;
            case 'INVALID_PROB':
              return <ModalWindow closeModal={closeModal}>확률은 0보다 크고 100이하인 수를 입력해야 합니다!</ModalWindow>;
            case 'INVALID_MIN':
              return <ModalWindow closeModal={closeModal}>N개 이상 포함의 N은 1~99사이의 정수를 입력해야 합니다!</ModalWindow>;
            case 'INVALID_MIN_VALUE':
              return <ModalWindow closeModal={closeModal}>N개 이상 포함의 N은 단어의 개수 이하여야 합니다!</ModalWindow>;
            case 'SUCCESS':
              return <ModalWindow closeModal={refreshModal}>성공적으로 처리되었습니다!</ModalWindow>;
            case 'SUCCESS_SEND':
              return <ModalWindow closeModal={refreshModal}>전송되었습니다!</ModalWindow>;
            case 'FAIL':
              return <ModalWindow closeModal={refreshModal}>오류가 발생하여 요청하신 작업이 처리되지 않았습니다!</ModalWindow>;
            case 'SPINNER':
              return <Spinner style={spinnerStyle}/>;
            default:
              return;
          }
        })()
      }
    </>
  );
};

export default Modal;