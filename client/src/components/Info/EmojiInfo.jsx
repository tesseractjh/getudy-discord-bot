import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { findAllElements, getSetter, isValidData, resize } from '../../util';
import DeleteIcon from '../../assets/images/x-circle.svg';
import EditIcon from '../../assets/images/pencil-square.svg';
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
  margin: 10px 0;
  border-top: 1px solid var(--color-red);
  animation: ${fadeIn} .2s;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: ${({ justify }) => justify};
  padding: 5px 0;
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

const EditButton = styled(Button)`
  padding: 20px;
  border-radius: 10px;
  background-color: var(--color-gray4);
  &:hover {
    background-color: var(--color-gray5);
  }
`;

const DeleteButton = styled(Button)`
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

const Content = (Tag, type) => ({ id, data, ...rest }) => {
  const tag = useRef();
  const [value, setValue] = useState(data);
  const handleInput = useCallback(e => {
    setValue(e.target.value);
  }, []);
  useEffect(() => {
    resize({ currentTarget: tag.current });
  }, []);
  return <Tag ref={tag} id={`${type}${id}`} value={value} onInput={handleInput} onChange={resize} spellCheck="false" {...rest} />
};

const EmojiContent = Content(Textarea, 'emoji');
const StartContent = Content(Textarea, 'start');
const EndContent = Content(Textarea, 'end');
const FixedContent = Content(Textarea, 'fixed');
const MinContent = Content(Textarea, 'min');
const WordContent = Content(Textarea, 'word');
const ExactContent = Content(Textarea, 'exact');
const ProbContent = Content(Textarea, 'prob');

const EmojiInfo = ({ data }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const list = useRef();
  const disabled = 0;
  const handleSuccess = useCallback(() => {
    dispatchModal({ type: 'SET', value: 'SUCCESS' });
  }, []);
  const handleFail = useCallback(() => {
    dispatchModal({ type: 'SET', value: 'FAIL' });
  }, []);
  const handleInvalid = useCallback((validation) => {
    dispatchModal({ type: 'SET', value: validation });
  }, []);

  const handleEdit = useCallback(async () => {
    const collected = findAllElements(list.current, 'textarea');
    const newData = getNewData(collected, data['_id']);
    const validation = isValidData(newData);
    if (validation === 'VALID') {
      const res = await fetch('/api/emoji', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      const result = await res.text();
      if (result === 'success') {
        handleSuccess();
      } else {
        handleFail();
      }
    } else {
      handleInvalid(validation);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    dispatchModal({ type: 'DATA_ID', value: data['_id'] });
    dispatchModal({ type: 'SET', value: 'DELETE' });
  }, []);
  
  return (
    <Form>
      <ul ref={list}>
        <ListItem>
          <Title htmlFor={`emoji${data['_id']}`}>이모지</Title>
          <EmojiContent disabled={disabled} id={data['_id']} data={data.emoji} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`start${data['_id']}`}>시작</Title>
          <StartContent disabled={disabled} id={data['_id']} data={data.options.start ?? ''} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`end${data['_id']}`}>끝</Title>
          <EndContent disabled={disabled} id={data['_id']} data={data.options.end ?? ''} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`fixed${data['_id']}`}>반드시 포함</Title>
          <FixedContent disabled={disabled} id={data['_id']} data={data.options.fixed} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`word${data['_id']}`}>
            <MinContent disabled={disabled} flex="0.5" align="right" bold id={data['_id']} data={data.options.min ?? 1} />
            개 이상 포함
          </Title>
          <WordContent disabled={disabled} id={data['_id']} data={data.options.isExact ? '' : data.word} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`exact${data['_id']}`}>정확히 일치</Title>
          <ExactContent id={data['_id']} data={data.options.isExact ? data.word : ''} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`exact${data['_id']}`}>확률</Title>
          <ProbContent id={data['_id']} data={data.probability * 100} />
        </ListItem>
        <ListItem justify="flex-end">
          <EditButton type="button" onClick={handleEdit}>
            <Icon as={EditIcon} />
            수정
          </EditButton>
          <DeleteButton type="button" onClick={handleDelete}>
            <Icon as={DeleteIcon} />
            삭제
          </DeleteButton>
        </ListItem>
      </ul>
    </Form>
  )
};

export default React.memo(EmojiInfo);