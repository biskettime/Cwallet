import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCog } from 'react-icons/fa';

const TotalContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingsButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;

  &:hover {
    color: #2c3e50;
  }
`;

const SettingsPopup = styled.div`
  position: absolute;
  top: 50px;
  right: 15px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 200px;
`;

const CurrencyOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 4px;

  &:hover {
    background: #f8f9fa;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const CurrencyLabel = styled.span`
  color: #2c3e50;
  font-size: 0.9rem;
`;

const AmountDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CurrencyAmount = styled.div`
  color: #2c3e50;
  font-size: ${props => props.isMain ? '1.8rem' : '1.2rem'};
  font-weight: 600;
`;

const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  KRW: { symbol: '₩', rate: 1300, name: '대한민국 원' },
  EUR: { symbol: '€', rate: 0.85, name: 'Euro' },
  JPY: { symbol: '¥', rate: 110, name: 'Japanese Yen' },
};

const GrandTotal = styled.div`
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
`;

const TotalTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1.1rem;
`;

const ExchangeTotals = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ExchangeTotal = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
`;

const ExchangeName = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const LoadingText = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: center;
  padding: 10px;
`;

const TotalInvestment = ({ exchanges, coins, coinPrices }) => {
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD']);

  useEffect(() => {
    if (Object.keys(coinPrices).length > 0) {
      setLoading(false);
    }
  }, [coinPrices]);

  const handleCurrencyToggle = (currencyCode) => {
    setSelectedCurrencies(prev => {
      if (prev.includes(currencyCode)) {
        // USD는 항상 선택되어 있어야 함
        if (currencyCode === 'USD') return prev;
        return prev.filter(c => c !== currencyCode);
      }
      return [...prev, currencyCode];
    });
  };

  const formatAmount = (amount, currencyCode) => {
    const convertedAmount = amount * currencies[currencyCode].rate;
    return `${currencies[currencyCode].symbol}${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: currencyCode === 'KRW' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'KRW' ? 0 : 2,
    })}`;
  };

  const calculateExchangeTotal = (exchangeId) => {
    const exchangeCoins = coins[exchangeId] || [];
    return exchangeCoins.reduce((total, coin) => {
      const currentPrice = coinPrices[coin.name.toLowerCase()]?.usd || 0;
      return total + (currentPrice * coin.quantity);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return exchanges.reduce((total, exchange) => {
      const exchangeTotal = calculateExchangeTotal(exchange.id);
      return total + exchangeTotal;
    }, 0);
  };

  const grandTotal = calculateGrandTotal();
  const hasCoins = exchanges.some(exchange => 
    (coins[exchange.id] || []).length > 0
  );

  if (!hasCoins) {
    return (
      <TotalContainer>
        <GrandTotal>
          <TotalTitle>총 투자 금액</TotalTitle>
          <AmountDisplay>
            {selectedCurrencies.map(currencyCode => (
              <CurrencyAmount 
                key={currencyCode}
                isMain={currencyCode === 'USD'}
              >
                {formatAmount(0, currencyCode)}
              </CurrencyAmount>
            ))}
          </AmountDisplay>
        </GrandTotal>
        <TotalTitle>거래소별 투자 금액</TotalTitle>
        <LoadingText>코인을 추가하면 여기에 총액이 표시됩니다.</LoadingText>
      </TotalContainer>
    );
  }

  if (loading && hasCoins) {
    return (
      <TotalContainer>
        <LoadingText>가격 정보를 불러오는 중...</LoadingText>
      </TotalContainer>
    );
  }

  return (
    <TotalContainer>
      <SettingsButton onClick={() => setShowSettings(!showSettings)}>
        <FaCog size={20} />
      </SettingsButton>
      
      {showSettings && (
        <SettingsPopup>
          {Object.entries(currencies).map(([code, { name }]) => (
            <CurrencyOption key={code}>
              <Checkbox
                type="checkbox"
                checked={selectedCurrencies.includes(code)}
                onChange={() => handleCurrencyToggle(code)}
                disabled={code === 'USD'} // USD는 항상 선택되어 있어야 함
              />
              <CurrencyLabel>{name} ({code})</CurrencyLabel>
            </CurrencyOption>
          ))}
        </SettingsPopup>
      )}

      <GrandTotal>
        <TotalTitle>총 투자 금액</TotalTitle>
        <AmountDisplay>
          {selectedCurrencies.map(currencyCode => (
            <CurrencyAmount 
              key={currencyCode}
              isMain={currencyCode === 'USD'}
            >
              {formatAmount(grandTotal, currencyCode)}
            </CurrencyAmount>
          ))}
        </AmountDisplay>
      </GrandTotal>

      <TotalTitle>거래소별 투자 금액</TotalTitle>
      <ExchangeTotals>
        {exchanges.map(exchange => {
          const exchangeTotal = calculateExchangeTotal(exchange.id);
          const percentage = grandTotal > 0 
            ? ((exchangeTotal / grandTotal) * 100).toFixed(1) 
            : 0;

          return (
            <ExchangeTotal key={exchange.id}>
              <ExchangeName>{exchange.name}</ExchangeName>
              <AmountDisplay>
                {selectedCurrencies.map(currencyCode => (
                  <CurrencyAmount 
                    key={currencyCode}
                    isMain={currencyCode === 'USD'}
                  >
                    {formatAmount(exchangeTotal, currencyCode)}
                  </CurrencyAmount>
                ))}
              </AmountDisplay>
              <ExchangeName>{percentage}%</ExchangeName>
            </ExchangeTotal>
          );
        })}
      </ExchangeTotals>
    </TotalContainer>
  );
};

export default TotalInvestment; 