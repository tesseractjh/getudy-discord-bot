import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../util';
import { HomeHeader } from './Home';

const Container = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-top: 50px;
  border-top: 5px solid var(--color-red);
  font-size: 24px;
`;

const Label = styled.label`
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid var(--color-black);
`;

const Button = styled.button`
  width: 120px;
  height: 40px;
  border-radius: 10px;
  background-color: var(--color-gray4);
  font-size: 20px;
  &:hover {
    background-color: var(--color-red);
    color: var(--color-white);
  }
`;

const Auth = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState();
  useEffect(() => {
    (async () => {
      const isAuthorized = await auth();
      setChecked(true);
      if (isAuthorized) {
        navigate('/admin');
      }
    })();
  }, []);
  const handleChange = useCallback(e => {
    setCode(e.target.value);
  }, []);
  const handleAuth = () => {
    localStorage.setItem('getudyAuth', code);
    (async () => {
      const isAuthorized = await auth();
      if (isAuthorized) {
        navigate('/admin');
      } else {
        alert('인증 실패!');
      }
    })();
  };
  return (
    <Container>
      {
        checked &&
        <>
          <HomeHeader>게터디봇 관리페이지</HomeHeader>
          <Form>
            <Label htmlFor="input">관리자 코드를 입력하세요</Label>
            <Input id="input" value={code} onChange={handleChange} />
            <Button type="button" onClick={handleAuth}>확인</Button>
          </Form>
        </>
      }
    </Container>
  );
};

export default Auth;