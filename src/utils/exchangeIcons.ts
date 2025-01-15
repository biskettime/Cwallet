interface ExchangeIcon {
  id: string;
  iconPath: string;
}

export const exchangeIcons: ExchangeIcon[] = [
  {
    id: 'binance',
    iconPath: '/assets/exchange-icons/binance.png'
  },
  {
    id: 'coinbase',
    iconPath: '/assets/exchange-icons/coinbase.png'
  },
  // 더 많은 거래소 추가
];

export const getExchangeIcon = (exchangeId: string): string => {
  const exchange = exchangeIcons.find(ex => ex.id === exchangeId);
  return exchange?.iconPath || '/assets/exchange-icons/default.png';
}; 