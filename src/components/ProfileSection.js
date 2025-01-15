import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  min-width: 300px;
`;

const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const SessionInfo = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9rem;
  width: 100%;
  margin-top: 5px;

  &:hover {
    background: #c0392b;
  }
`;

const ProfileSection = ({ user, onLogout }) => {
  const [sessionTime, setSessionTime] = useState('0분');
  const [loginTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - loginTime) / 1000 / 60);
      
      if (diff < 60) {
        setSessionTime(`${diff}분`);
      } else {
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        setSessionTime(`${hours}시간 ${minutes}분`);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [loginTime]);

  const getInitials = (email) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileImage>
          {getInitials(user.email)}
        </ProfileImage>
        <UserInfo>
          <UserName>{user.email}님 환영합니다</UserName>
          <SessionInfo>
            로그인: {format(loginTime, 'a h:mm', { locale: ko })}
            {' • '}
            접속시간: {sessionTime}
          </SessionInfo>
        </UserInfo>
      </ProfileContent>
      <LogoutButton onClick={onLogout}>
        로그아웃
      </LogoutButton>
    </ProfileContainer>
  );
};

export default ProfileSection; 