import React from "react";
import styled from "styled-components";
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const CoinCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 600;
  min-width: 100px;
  width: fit-content;
  white-space: nowrap;
  position: absolute;
  top: 15px;
  right: 15px;
  
  &:hover {
    background: #c0392b;
  }
`;

const CoinHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
  margin-bottom: 15px;
  padding-right: 120px;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CoinNamePrice = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 500;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.isPositive ? '#2ecc71' : '#e74c3c'};
  font-size: 0.9rem;
  font-weight: 500;
`;

const CoinIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const CoinName = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;

const CurrentPrice = styled.div`
  text-align: right;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const PriceValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
`;

const QuantityText = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const TotalValue = styled.div`
  color: #27ae60;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TotalLabel = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: normal;
`;

const Coin = ({ coin, price, priceChange24h, onRemove }) => {
  const total = price * coin.quantity;
  const isPositive = priceChange24h?.percentage >= 0;
  const PriceIcon = isPositive ? FaCaretUp : FaCaretDown;

  return (
    <CoinCard>
      <RemoveButton onClick={() => onRemove(coin.name)}>
        Remove
      </RemoveButton>
      
      <CoinHeader>
        <CoinInfo>
          <CoinIcon src={coin.icon} alt={coin.name} />
          <div>
            <CoinNamePrice>
              <CoinName>{coin.name} ({coin.symbol})</CoinName>
              <PriceInfo>
                ${price ? price.toLocaleString() : '0.00'}
                {priceChange24h && (
                  <PriceChange isPositive={isPositive}>
                    <PriceIcon />
                    ${Math.abs(priceChange24h.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    ({Math.abs(priceChange24h.percentage).toFixed(2)}%)
                  </PriceChange>
                )}
              </PriceInfo>
            </CoinNamePrice>
            <QuantityText>수량: {coin.quantity} units</QuantityText>
          </div>
        </CoinInfo>
      </CoinHeader>
      
      <PriceContainer>
        <CurrentPrice>
          <TotalValue>
            <TotalLabel>Total:</TotalLabel>
            ${total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </TotalValue>
        </CurrentPrice>
      </PriceContainer>
    </CoinCard>
  );
};

export default Coin;