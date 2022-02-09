import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { LinkDispatch, EmojiDispatch, ModalDispatch } from '../../pages/Home';

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

const ModalWindow = ({ confirm, closeModal, dataId, children }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const deleteLink = useCallback(async () => {
    const res = await fetch(`/api/link/${dataId}`, {
      method: 'DELETE'
    });
    const result = await res.text();
    if (result === 'success') {
      dispatchModal({ type: 'SET', value: 'SUCCESS' });
    } else {
      dispatchModal({ type: 'SET', value: 'FAIL' });
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
            <YesButton onClick={confirm ? deleteLink : closeModal}>
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
  const { modal: { type, dataId }, dispatchModal } = useContext(ModalDispatch);
  const closeModal = useCallback(() => {
    dispatchModal({ type: 'SET', value: false });
  }, []);
  const refreshModal = useCallback(() => {
    dispatchModal({ type: 'SET', value: false });
    fetch(`/api/${page}`)
      .then(res => res.json())
      .then(json => dispatch({ type: 'GET', json }));
  }, []);
  return (
    <>
      <Background onClick={closeModal} />
      {
        (() => {
          switch (type) {
            case 'DELETE': 
              return <ModalWindow closeModal={closeModal} dataId={dataId} confirm>정말로 삭제하시겠습니까?</ModalWindow>;
            case 'INVALID_REQ':
              return <ModalWindow closeModal={closeModal}>이모지, ~개 이상 포함, 확률은 필수사항입니다!</ModalWindow>;
            case 'INVALID_PROB':
              return <ModalWindow closeModal={closeModal}>확률은 0보다 크고 100이하인 수를 입력해야 합니다!</ModalWindow>;
            case 'INVALID_MIN':
              return <ModalWindow closeModal={closeModal}>N개 이상 포함의 N은 1~99사이의 정수를 입력해야 합니다!</ModalWindow>;
            case 'INVALID_MIN_VALUE':
              return <ModalWindow closeModal={closeModal}>N개 이상 포함의 N은 단어의 개수 이하여야 합니다!</ModalWindow>;
            case 'SUCCESS':
              return <ModalWindow closeModal={refreshModal}>성공적으로 처리되었습니다!</ModalWindow>;
            case 'FAIL':
              return <ModalWindow closeModal={refreshModal}>오류가 발생하여 요청하신 작업이 처리되지 않았습니다!</ModalWindow>;
            case 'ADD_EMOJI':
              return;
            default:
              return;
          }
        })()
      }
    </>
  );
};

export default Modal;