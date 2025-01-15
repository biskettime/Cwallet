import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Coin from "./Coin";
import AddCoinForm from "./AddCoinForm";
import ExchangeList from "./ExchangeList";
import AddExchangeModal from "./AddExchangeModal";
import TotalInvestment from "./TotalInvestment";
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const WalletContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
`;

const WalletContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CoinListContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Wallet = ({ userId }) => {
  const [exchanges, setExchanges] = useState([]);
  const [activeExchange, setActiveExchange] = useState(null);
  const [showAddExchange, setShowAddExchange] = useState(false);
  const [coins, setCoins] = useState({});
  const [coinPrices, setCoinPrices] = useState({});

  // 데이터 로드
  useEffect(() => {
    const userDoc = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setExchanges(data.exchanges || []);
        setCoins(data.coins || {});
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // 코인 가격 정보 가져오기
  useEffect(() => {
    const fetchPrices = async () => {
      const allCoins = Object.values(coins).flat();
      const uniqueCoins = [...new Set(allCoins.map(coin => coin.name.toLowerCase()))];
      
      if (uniqueCoins.length === 0) return;

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          {
            params: {
              ids: uniqueCoins.join(','),
              vs_currencies: 'usd'
            }
          }
        );
        setCoinPrices(response.data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [coins]);

  // 데이터 저장
  const saveData = async (newExchanges, newCoins) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        exchanges: newExchanges,
        coins: newCoins
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleAddExchange = (newExchange) => {
    const updatedExchanges = [...exchanges, newExchange];
    setExchanges(updatedExchanges);
    setCoins({ ...coins, [newExchange.id]: [] });
    saveData(updatedExchanges, coins);
  };

  const handleAddCoin = (newCoin) => {
    if (!activeExchange) return;
    const exchangeCoins = coins[activeExchange.id] || [];
    const updatedCoins = {
      ...coins,
      [activeExchange.id]: [...exchangeCoins, newCoin]
    };
    setCoins(updatedCoins);
    saveData(exchanges, updatedCoins);
  };

  const handleRemoveCoin = (coinName) => {
    if (!activeExchange) return;
    const exchangeCoins = coins[activeExchange.id] || [];
    const updatedCoins = {
      ...coins,
      [activeExchange.id]: exchangeCoins.filter(coin => coin.name !== coinName)
    };
    setCoins(updatedCoins);
    saveData(exchanges, updatedCoins);
  };

  const handleDeleteExchange = async (exchangeId) => {
    if (window.confirm('이 거래소와 관련된 모든 코인 정보가 삭제됩니다. 계속하시겠습니까?')) {
      const updatedExchanges = exchanges.filter(exchange => exchange.id !== exchangeId);
      const updatedCoins = { ...coins };
      delete updatedCoins[exchangeId];
      
      setExchanges(updatedExchanges);
      setCoins(updatedCoins);
      if (activeExchange?.id === exchangeId) {
        setActiveExchange(null);
      }
      
      // Firebase에 저장
      await saveData(updatedExchanges, updatedCoins);
    }
  };

  return (
    <WalletContainer>
      <ExchangeList
        exchanges={exchanges}
        activeExchange={activeExchange}
        onSelectExchange={setActiveExchange}
        onAddExchange={() => setShowAddExchange(true)}
        onDeleteExchange={handleDeleteExchange}
      />
      
      <WalletContent>
        <TotalInvestment 
          exchanges={exchanges} 
          coins={coins}
          coinPrices={coinPrices}
        />
        
        <CoinListContainer>
          {activeExchange ? (
            <>
              <h2>{activeExchange.name} 코인 목록</h2>
              <AddCoinForm onAdd={handleAddCoin} />
              {(coins[activeExchange.id] || []).map((coin) => (
                <Coin 
                  key={coin.name} 
                  coin={coin} 
                  price={coinPrices[coin.name.toLowerCase()]?.usd}
                  priceChange24h={null}
                  onRemove={handleRemoveCoin}
                />
              ))}
            </>
          ) : (
            <p>왼쪽에서 거래소를 선택하거나 추가해주세요.</p>
          )}
        </CoinListContainer>
      </WalletContent>

      {showAddExchange && (
        <AddExchangeModal
          onClose={() => setShowAddExchange(false)}
          onAdd={handleAddExchange}
        />
      )}
    </WalletContainer>
  );
};

export default Wallet;