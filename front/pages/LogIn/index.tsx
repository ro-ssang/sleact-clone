import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const Login = () => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3090/api/users', fetcher);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [logInError, setLogInError] = useState('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError('');
      axios
        .post('/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          setLogInError(error.response?.data);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>{logInError}</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
