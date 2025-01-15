import React from 'react';
import styled from 'styled-components';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ExchangeListContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ExchangeItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: space-between;
  
  ${props => props.active && `
    background: #e3f2fd;
  `}

  &:hover {
    background: ${props => props.active ? '#e3f2fd' : '#f8f9fa'};
  }
`;

const ExchangeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const ExchangeIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const ExchangeName = styled.span`
  color: #2c3e50;
  font-weight: ${props => props.active ? '600' : '400'};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: none;
  color: #95a5a6;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  padding: 5px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  ${ExchangeItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #c0392b;
  }
`;

const ExchangeList = ({ 
  exchanges, 
  activeExchange, 
  onSelectExchange, 
  onAddExchange,
  onDeleteExchange 
}) => {
  return (
    <ExchangeListContainer>
      {exchanges.map(exchange => (
        <ExchangeItem
          key={exchange.id}
          active={activeExchange?.id === exchange.id}
          onClick={() => onSelectExchange(exchange)}
        >
          <ExchangeInfo>
            <ExchangeIcon src={exchange.icon} alt={exchange.name} />
            <ExchangeName active={activeExchange?.id === exchange.id}>
              {exchange.name}
            </ExchangeName>
          </ExchangeInfo>
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteExchange(exchange.id);
            }}
            title="거래소 삭제"
          >
            <FaTrash size={14} />
          </DeleteButton>
        </ExchangeItem>
      ))}
      <AddButton onClick={onAddExchange}>
        <FaPlus /> 거래소 추가
      </AddButton>
    </ExchangeListContainer>
  );
};

export default ExchangeList; 