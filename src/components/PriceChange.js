import React from 'react';
import styled from 'styled-components';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const PriceChangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 10px;
  background: ${props => props.trend === 'up' ? 'rgba(46, 204, 113, 0.1)' : props.trend === 'down' ? 'rgba(231, 76, 60, 0.1)' : 'transparent'};
  border-radius: 8px;
  width: 200px;
`;

const ChangeValue = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.trend === 'up' ? '#2ecc71' : '#e74c3c'};
  font-weight: 600;
  font-size: 1.1rem;
`;

const ChangePercent = styled.div`
  color: ${props => props.trend === 'up' ? '#27ae60' : '#c0392b'};
  font-size: 0.9rem;
  margin-top: 3px;
`;

const PriceChange = ({ amount, percentage }) => {
  const trend = percentage >= 0 ? 'up' : 'down';
  const Icon = trend === 'up' ? FaCaretUp : FaCaretDown;

  return (
    <PriceChangeContainer trend={trend}>
      <ChangeValue trend={trend}>
        <Icon />
        ${Math.abs(amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </ChangeValue>
      <ChangePercent trend={trend}>
        {Math.abs(percentage).toFixed(2)}%
      </ChangePercent>
    </PriceChangeContainer>
  );
};

export default PriceChange; 