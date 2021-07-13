import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR('http://localhost:3090/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidate();
    });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </>
  );
};

export default Workspace;
