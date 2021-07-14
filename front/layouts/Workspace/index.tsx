import Menu from '@components/Menu';
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import loadable from '@loadable/component';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3090/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data === false) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.email, { s: '28', d: 'retro' })} alt={data.email} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: '36', d: 'retro' })} alt={data.email} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </>
  );
};

export default Workspace;
