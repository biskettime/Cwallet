import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';

const exchanges = [
  {
    id: 'upbit',
    name: '업비트',
    icon: 'https://static.upbit.com/logos/upbit-icon-circle.png'
  },
  {
    id: 'binance',
    name: '바이낸스',
    icon: 'https://bin.bnbstatic.com/static/images/common/favicon.ico'
  },
  {
    id: 'bithumb',
    name: '빗썸',
    icon: 'https://www.bithumb.com/react/logo/bithumb-bi.png'
  },
  {
    id: 'coinone',
    name: '코인원',
    icon: 'https://coinone.co.kr/favicon.ico'
  },
  {
    id: 'kraken',
    name: '크라켄',
    icon: 'https://assets.kraken.com/images/favicon.ico'
  },
  {
    id: 'kucoin',
    name: '쿠코인',
    icon: 'https://www.kucoin.com/_nuxt/img/kucoin-icon.svg'
  },
  {
    id: 'bybit',
    name: '바이비트',
    icon: 'https://www.bybit.com/common/static/media/favicon.svg'
  },
  {
    id: 'gate',
    name: '게이트아이오',
    icon: 'https://www.gate.io/images/favicon.ico'
  },
  {
    id: 'huobi',
    name: '후오비',
    icon: 'https://www.huobi.com/favicon.ico'
  },
  {
    id: 'mexc',
    name: 'MEXC',
    icon: 'https://www.mexc.com/favicon.ico'
  }
];

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0 0 20px 0;
`;

const ExchangeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const ExchangeOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  ${props => props.selected && `
    background: #e3f2fd;
    border-color: #2196f3;
  `}
`;

const ExchangeIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const ExchangeName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  ${props => props.primary ? `
    background: #2ecc71;
    color: white;
    &:hover {
      background: #27ae60;
    }
  ` : `
    background: #e74c3c;
    color: white;
    &:hover {
      background: #c0392b;
    }
  `}
`;

const getBackupIconUrl = (exchangeId) => {
  const backupUrls = {
    'upbit': 'https://play-lh.googleusercontent.com/eqQQvh6YV9f7nJYVqAYjBgfOoJBwpWHJQXI5RDO6n_oLz6Y0f7UHtJvqYGE_fYwg8Q=s64',
    'binance': 'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/87496d50-2638-4486-9314-d8e605b76a46.png',
    'bithumb': 'https://play-lh.googleusercontent.com/KGeSI4bTWJ4TpPH4LuOAkoLM_IkVjGVZz_mWqGb5eDfDNOEZL2MWs9QZcXP7YQdYfHo=s64',
    'coinone': 'https://play-lh.googleusercontent.com/LPZe878fGnHJCiPtUxFEZUups7KGz6-9pF3FAQXVl6O0TkLKQAkNp-M8hX_qoMJqng=s64',
    'kraken': 'https://play-lh.googleusercontent.com/xaGHQbNQZ1tQq3oXmGkpPf-QEXZMRuJ-WgEtdxbxhv3LXe-yHPDQUBBXXxclKOgz1w=s64',
    'kucoin': 'https://assets.staticimg.com/cms/media/1lB3PkckFDyfxz6VudCEACBeRRBi6sQQ7DDjz0yWM.png',
    'bybit': 'https://www.bybit.com/common/static/media/favicon.svg',
    'gate': 'https://www.gate.io/images/gate.io.png',
    'huobi': 'https://www.huobi.com/favicon.ico',
    'mexc': 'https://www.mexc.com/assets/mexc-logo.png'
  };
  return backupUrls[exchangeId] || null;
};

const AddExchangeModal = ({ onClose, onAdd }) => {
  const [selectedExchange, setSelectedExchange] = useState(null);

  const handleAdd = () => {
    if (selectedExchange) {
      const exchange = {
        ...selectedExchange,
        id: `${selectedExchange.id}_${uuidv4().slice(0, 8)}`
      };
      onAdd(exchange);
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>거래소 추가</Title>
        <ExchangeGrid>
          {exchanges.map(exchange => (
            <ExchangeOption
              key={exchange.id}
              selected={selectedExchange?.id === exchange.id}
              onClick={() => setSelectedExchange(exchange)}
            >
              <ExchangeIcon 
                src={exchange.icon} 
                alt={exchange.name}
                onError={(e) => {
                  e.target.onerror = null;
                  const backupUrl = getBackupIconUrl(exchange.id);
                  if (backupUrl) {
                    e.target.src = backupUrl;
                  } else {
                    e.target.src = `https://ui-avatars.com/api/?name=${exchange.name}&background=random&size=24`;
                  }
                }}
              />
              <ExchangeName>{exchange.name}</ExchangeName>
            </ExchangeOption>
          ))}
        </ExchangeGrid>
        <ButtonContainer>
          <Button onClick={onClose}>취소</Button>
          <Button 
            primary 
            onClick={handleAdd}
            disabled={!selectedExchange}
          >
            추가
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddExchangeModal; 