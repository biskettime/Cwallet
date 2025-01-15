import React, { useState } from 'react';
import { getExchangeIcon } from '../utils/exchangeIcons';

interface ExchangeIconProps {
  exchangeId: string;
  size?: number;
}

export const ExchangeIcon: React.FC<ExchangeIconProps> = ({ exchangeId, size = 24 }) => {
  const [error, setError] = useState<boolean>(false);
  const iconPath = getExchangeIcon(exchangeId);

  return (
    <img
      src={error ? '/assets/exchange-icons/default.png' : iconPath}
      alt={`${exchangeId} icon`}
      width={size}
      height={size}
      onError={() => setError(true)}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default ExchangeIcon; 