import styled from 'styled-components';
import { customReq, resize } from '../util';
import EnterIcon from '../assets/images/box-arrow-in-right.svg';
import { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { ModalDispatch } from '../pages/Home';
import { CH_NORMAL } from '../../../bot/constants';

const BambooContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--color-orange1);
`;

const Form = styled.form`
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  min-height: 100px;
  padding: 20px 5%;
`;

const Select = styled.select`
  width: 80%;
  margin: 20px 10% 0;
  font-size: 20px;
  text-align: center;
`;

const Input = styled.textarea`
  width: 100%;
  max-width: 768px;
  height: 50px;
  padding: 10px 30px;
  background-color: var(--color-white);
  border-radius: 20px;
  font-size: 25px;
  overflow: hidden;
`;

const Button = styled.button`
  flex-shrink: 0;
  flex-basis: 120px;
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 120px;
  height: 24px;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: var(--color-gray4);
  font-size: 20px;
  &:hover {
    background-color: var(--color-red);
    color: var(--color-white);
  }
  &:hover svg {
    fill: var(--color-white);
  }
`;

const Icon = styled.svg`
  transform: scale(1.875);
`;

const BambooFooter = styled.p`
  padding-bottom: 20px;
  font-size: 16px;
  text-align: center;
`;

const Bamboo = () => {
  const { dispatchModal } = useContext(ModalDispatch);
  const [message, setMessage] = useState('');
  const [channelList, setChannelList] = useState([]);
  const select = useRef();

  const handleInput = useCallback(e => {
    setMessage(e.target.value);
  }, []);

  const handleSend = useCallback(async () => {
    if (!message) return;
    const id = [...select.current.children].find(({ selected }) => selected).value;
    const res = fetch('/api/message', customReq('POST', { id, message }));
    const result = await res.text();
    if (result === 'success') {
      dispatchModal({ type: 'WINDOW', value: 'SUCCESS' });
    } else {
      dispatchModal({ type: 'WINDOW', value: 'FAIL' });
    }
  }, [message]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/channel', customReq());
      const json = await res.json();
      setChannelList(json);
    })();
  }, []);

  return (
    <BambooContainer>
      <Form>
        <Select ref={select}>
          <option value="none">=== 채널 선택 ===</option>
          {
            channelList?.map(channel => (
              <option
                key={channel.id}
                value={channel.id}
                selected={channel.id === CH_NORMAL}
              >
                {channel.name}
              </option>
            ))
          }
        </Select>
        <InputWrapper>
          <Input value={message} onInput={handleInput} onChange={resize}/>
          <Button type="button" onClick={handleSend}>
            <Icon as={EnterIcon} />
            입력
          </Button>
        </InputWrapper>
      </Form>
      <BambooFooter>바른말 고운말을 씁시다</BambooFooter>
    </BambooContainer>
  );
};

export default Bamboo;