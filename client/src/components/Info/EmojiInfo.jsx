import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { customReq, findAllElements, getSetter, isValidData, resize } from '../../util';
import DeleteIcon from '../../assets/images/x-circle.svg';
import EditIcon from '../../assets/images/pencil-square.svg';
import InfoIcon from '../../assets/images/question-circle.svg';
import { getNewData } from '../../util';
import { ModalDispatch } from '../../pages/Home';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Form = styled.form`
  flex: 1;
  position: ${({ isRegister }) => isRegister ? 'fixed' : 'static'};
  top: ${({ isRegister }) => isRegister ? '50%' : 0};
  left: ${({ isRegister }) => isRegister ? '50%' : 0};
  transform: ${({ isRegister }) => isRegister ? 'translate(-50%, -50%)' : 'none'};
  width: ${({ isRegister }) => isRegister ? '100vw' : 'auto'};
  max-width: ${({ isRegister }) => isRegister ? '1024px' : 'auto'};
  padding: ${({ isRegister }) => isRegister ? '40px' : 0};
  margin: 10px 0;
  border-top: ${({ isRegister }) => isRegister ? 'none' : `1px solid var(--color-red)`};
  background-color: ${({ isRegister }) => isRegister ? 'var(--color-white)' : 'none'};
  animation: ${fadeIn} ${({ isRegister }) => isRegister ? 0 : '.2s'};
`;

const ListItem = styled.li`
  display: flex;
  justify-content: ${({ justify }) => justify};
  padding: 5px 0;
  font-family: 'SUIT Variable', sans-serif;
`;

const Title = styled.label`
  max-width: 190px;
  flex-basis: 200px;
  align-self: flex-start;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  font-size: 20px;
  font-weight: 700;
  line-height: 45px;
  &::after {
    content: ':';
  }
`;

const Textarea = styled.textarea`
  flex: ${({ flex }) => flex ?? 1};
  height: 45px;
  padding: 10px;
  border-radius: 10px;
  font-weight: ${({ bold }) => bold ? 700 : 400};
  font-size: 20px;
  overflow: hidden;
  word-break: break-all;
  text-decoration: ${({ exact }) => exact ? 'line-through' : 'none'};
  text-align: ${({ align }) => align ?? 'left'};
  &:focus {
    background-color: var(--color-gray5);
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 24px;
  font-size: 20px;
  &:hover {
    color: var(--color-red);
  }
  &:hover svg {
    fill: var(--color-red);
  }
`;

const LeftButton = styled(Button)`
  padding: 20px;
  border-radius: 10px;
  background-color: var(--color-gray4);
  &:hover {
    background-color: var(--color-gray5);
  }
`;

const RightButton = styled(Button)`
  padding: 20px;
  margin-left: 20px;
  border-radius: 10px;
  background-color: var(--color-gray4);
  color: var(--color-red);
  &:hover {
    background-color: var(--color-red);
    color: var(--color-white);
  }
  & svg {
    fill: var(--color-red);
  }
  &:hover svg {
    fill: var(--color-white);
  }
`;

const Icon = styled.svg`
  transform: scale(${({ scale }) => scale ?? 1.5});
`;

const FormFooter = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-size: 18px;
  line-height: 36px;
`;

const Content = (type) => ({ id, data, setExact, ...rest }) => {
  const tag = useRef();
  const [value, setValue] = useState(data);
  const handleInput = useCallback(e => {
    setValue(e.target.value);
    if (setExact) {
      if (e.target.value) {
        setExact(true);
      } else {
        setExact(false);
      }
    }
  }, []);
  useEffect(() => {
    resize({ currentTarget: tag.current });
    if (setExact && tag.current.value) {
      setExact(true);
    }
  }, []);
  return <Textarea ref={tag} id={`${type}${id}`} value={value} onInput={handleInput} onChange={resize} spellCheck="false" {...rest} />
};

const EmojiContent = Content('emoji');
const StartContent = Content('start');
const EndContent = Content('end');
const FixedContent = Content('fixed');
const MinContent = Content('min');
const WordContent = Content('word');
const ExactContent = Content('exact');
const ProbContent = Content('prob');

const EmojiInfo = ({ data, isRegister }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const list = useRef();
  const [exact, setExact] = useState(false);
  const [info, setInfo] = useState(false);
  const disabled = 0;

  const handleEdit = useCallback((method = 'PUT') => async () => {
    const collected = findAllElements(list.current, 'textarea');
    const newData = getNewData(collected, data['_id']);
    const validation = isValidData(newData);
    if (validation === 'VALID') {
      dispatchModal({ type: 'WINDOW', value: 'SPINNER' });
      const res = await fetch('/api/emoji', customReq(method, newData));
      const result = await res.text();
      if (result === 'success') {
        dispatchModal({ type: 'WINDOW', value: 'SUCCESS' });
      } else {
        dispatchModal({ type: 'WINDOW', value: 'FAIL' });
      }
    } else {
      dispatchModal({ type: 'WINDOW', value: validation });
    }
  }, []);

  const handleDelete = useCallback(async () => {
    dispatchModal({ type: 'SET_DATA_ID', value: data['_id'] });
    dispatchModal({ type: 'WINDOW', value: 'DELETE' });
  }, []);

  const handleInfo = useCallback(() => {
    setInfo(prev => !prev);
  });
  
  return (
    <Form isRegister={isRegister}>
      <ul ref={list}>
        <ListItem>
          <Title htmlFor={`emoji${data['_id']}`}>?????????</Title>
          <EmojiContent disabled={disabled} id={data['_id']} data={data?.emoji} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`start${data['_id']}`}>??????</Title>
          <StartContent disabled={disabled} id={data['_id']} data={data?.options?.start} exact={exact} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`end${data['_id']}`}>???</Title>
          <EndContent disabled={disabled} id={data['_id']} data={data?.options?.end} exact={exact} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`fixed${data['_id']}`}>????????? ??????</Title>
          <FixedContent disabled={disabled} id={data['_id']} data={data?.options?.fixed} exact={exact} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`word${data['_id']}`}>
            <MinContent disabled={disabled} flex="0.5" align="right" bold id={data['_id']} data={data?.options?.min ?? 1} />
            ??? ?????? ??????
          </Title>
          <WordContent disabled={disabled} id={data['_id']} data={data?.options?.isExact ? '' : data?.word} exact={exact} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`exact${data['_id']}`}>????????? ??????</Title>
          <ExactContent id={data['_id']} data={data?.options?.isExact ? data?.word : ''} setExact={setExact} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`prob${data['_id']}`}>??????</Title>
          <ProbContent id={data['_id']} data={Number.isNaN(data?.probability * 100) ? '' : data.probability * 100} />
        </ListItem>
        <ListItem justify="flex-end">
          {
            isRegister
              ? <>
                <LeftButton type="button" onClick={handleInfo}>
                  <Icon as={InfoIcon} />
                  ?????????
                </LeftButton>
                <RightButton type="button" onClick={handleEdit('POST')}>
                  <Icon as={EditIcon} />
                  ??????
                </RightButton>
              </>
              : <>
                <LeftButton type="button" onClick={handleEdit()}>
                  <Icon as={EditIcon} />
                  ??????
                  </LeftButton>
                <RightButton type="button" onClick={handleDelete}>
                  <Icon as={DeleteIcon} />
                  ??????
                </RightButton>
              </>
          }
        </ListItem>
      </ul>
      {
        info &&
        <FormFooter>
          ???????????? ????????? ????????? ???????????? ?????????.
          <br />
          ???????????? ????????? ????????? ????????? ??? ?????? 1?????? ????????? ???????????? ?????????.
          <br />
          ???????????? ????????? ?????? ??? ????????? ????????? ????????? ???????????? ?????????.
          <br />
          ??????????????? ????????? ????????? ???????????????, ????????? ????????? ??? ???????????? ????????? ???????????????.
          <br />
          ????????? ????????? ?????????????????? ?????? ?????? ??????????????? ??????(\)??? ??????????????????.
          <br />
          ????????? ?????? ?????? ???????????? ?????? ?????? ?????? ??? ?????? ?????? ?????? ????????? ????????? ???????????????.
          <br />
          ??? ?????? ????????? ???????????? ??? ???????????? ??????????????? ?????? ???????????? ???????????? ????????? ?????? ????????? ????????? ???????????? ????????? ???????????????.
        </FormFooter>
      }
    </Form>
  )
};

export default React.memo(EmojiInfo);