import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Wallet from "./components/Wallet";
import Login from "./components/Login";
import ProfileSection from "./components/ProfileSection";
import { auth } from './firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaWallet } from 'react-icons/fa';

const AppContainer = styled.div`
  background-color: #f5f6fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px 20px 80px 20px;
`;

const MainContent = styled.div`
  flex: 1;
`;

const Footer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 0.9rem;
`;

const FooterText = styled.p`
  margin: 0;
  opacity: 0.9;
`;

const FooterLink = styled.a`
  color: #3498db;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoIcon = styled(FaWallet)`
  font-size: 2.5rem;
  color: #3498db;
  filter: drop-shadow(0 2px 4px rgba(52, 152, 219, 0.2));
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    font-weight: 300;
    color: #3498db;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setInitError("Firebase 초기화에 실패했습니다.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setInitError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (initError) {
    return <div>Error: {initError}</div>;
  }

  return (
    <AppContainer>
      <MainContent>
        {user ? (
          <>
            <Header>
              <HeaderContent>
                <TitleSection>
                  <LogoIcon />
                  <Title>
                    <span>Crypto</span> My Wallet
                  </Title>
                </TitleSection>
                <ProfileSection 
                  user={user} 
                  onLogout={handleLogout}
                />
              </HeaderContent>
            </Header>
            <Wallet userId={user.uid} />
          </>
        ) : (
          <Login />
        )}
      </MainContent>
      <Footer>
        <FooterText>
          © {new Date().getFullYear()} The Flow. All rights reserved.
          {' | '}
          <FooterLink href="https://theflow.co.kr" target="_blank" rel="noopener noreferrer">
            Visit The Flow
          </FooterLink>
        </FooterText>
      </Footer>
    </AppContainer>
  );
}

export default App;