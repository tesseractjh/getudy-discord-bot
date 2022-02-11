import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { customReq, findAllElements, resize } from '../../util';
import DeleteIcon from '../../assets/images/x-circle-fill.svg';
import EditIcon from '../../assets/images/pencil-square.svg';
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
  animation: ${fadeIn} .3s;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: ${({ justify }) => justify};
  padding: 5px 0;
`;

const Title = styled.label`
  flex-shrink: 1;
  flex-basis: 100px;
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
  flex: 1;
  height: 45px;
  padding: 10px;
  border-radius: 10px;
  font-size: 20px;
  overflow: hidden;
  word-break: break-all;
  &:focus {
    background-color: var(--color-gray5);
  }
`;

const KeywordList = styled.ul`
  flex: 1;
`;

const KeywordItem = styled.li`
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  flex: 1;
  align-self: flex-start;
  display: flex;
  margin-top: 10.5px;
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

const KeywordButton = styled(Button)`
  display: ${({ isFocused }) => isFocused ? 'inline-flex' : 'none'};
  margin-left: 10px;
`;

const Icon = styled.svg`
  transform: scale(${({ scale }) => scale ?? 1.5});
`;

const KeywordTextarea = styled(Textarea)`
  flex: 10;
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

const TitleContent = Content(Textarea, 'title');
const LinkContent = Content(Textarea, 'link');
const KeywordContent = Content(KeywordTextarea, 'keywords');

const Keyword = ({ dataId, data, list }) => {
  const item = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(e => {
    setIsFocused(true);
  }, []);
  const handleBlur = useCallback(e => {
    setIsFocused(false);
  }, []);
  const handleDeleteClick = useCallback(e => {
    list.current.removeChild(item.current);
  }, []);
  return (
    <KeywordItem ref={item}>
      <KeywordContent id={dataId} data={data} onFocus={handleFocus} onBlur={handleBlur}/>
      <ButtonWrapper>
        <KeywordButton type="button" onMouseDown={handleDeleteClick} isFocused={isFocused}>
          <Icon as={DeleteIcon} />
        </KeywordButton>
      </ButtonWrapper>
    </KeywordItem>
  );
};

const LinkInfo = ({ data }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const list = useRef();
  const keywordList = useRef();
  const handleSuccess = useCallback(() => {
    dispatchModal({ type: 'WINDOW', value: 'SUCCESS' });
  }, []);
  const handleFail = useCallback(() => {
    dispatchModal({ type: 'WINDOW', value: 'FAIL' });
  }, []);
  const handleClick = useCallback(async () => {
    const collected = findAllElements(list.current, 'textarea');
    const newData = {
      _id: data['_id'],
      title: collected[0],
      link: collected[1],
      keywords: collected.slice(2)
    };
    const res = await fetch('/api/link', customReq('PUT', newData));
    const result = await res.text();
    if (result === 'success') {
      handleSuccess();
    } else {
      handleFail();
    }
  }, []);
  
  return (
    <Form>
      <ul ref={list}>
        <ListItem>
          <Title htmlFor={`title${data['_id']}`}>제목</Title>
          <TitleContent id={data['_id']} data={data.title} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`link${data['_id']}`}>링크</Title>
          <LinkContent id={data['_id']} data={data.link} />
        </ListItem>
        <ListItem>
          <Title htmlFor={`keywords${data['_id']}`}>키워드</Title>
          <KeywordList ref={keywordList}>
            {
              data.keywords.map((keyword, i) => {
                return <Keyword key={i} dataId={data['_id']} data={keyword} list={keywordList} />;
              })
            }
          </KeywordList>
        </ListItem>
        <ListItem justify="flex-end">
          <EditButton type="button" onClick={handleClick}>
            <Icon as={EditIcon} />
            수정
          </EditButton>
        </ListItem>
      </ul>
    </Form>
  )
};

export default React.memo(LinkInfo);