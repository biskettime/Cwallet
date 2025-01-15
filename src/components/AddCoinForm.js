import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { debounce } from 'lodash';

const FormContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const CoinList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const CoinOption = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f8f9fa;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const QuantityInput = styled.input`
  width: 150px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-right: 10px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #27ae60;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const AddCoinForm = ({ onAdd }) => {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const searchCoins = async (query) => {
    if (!query) {
      setCoins([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );
      setCoins(response.data.coins.slice(0, 10)); // 상위 10개 결과만 표시
    } catch (error) {
      console.error("Error searching coins:", error);
    }
  };

  // debounce를 사용하여 API 호출 최적화
  const debouncedSearch = debounce(searchCoins, 300);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
    return () => debouncedSearch.cancel();
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCoin && quantity) {
      onAdd({
        name: selectedCoin.id,
        symbol: selectedCoin.symbol.toUpperCase(),
        icon: selectedCoin.large,
        quantity: parseFloat(quantity)
      });
      setSearch("");
      setQuantity("");
      setSelectedCoin(null);
      setShowResults(false);
    }
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setSearch(`${coin.name} (${coin.symbol.toUpperCase()})`);
    setShowResults(false);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="코인 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <CoinList show={showResults}>
          {coins.map((coin) => (
            <CoinOption
              key={coin.id}
              onClick={() => handleCoinSelect(coin)}
            >
              <img src={coin.thumb} alt={coin.name} />
              <div>{coin.name} ({coin.symbol.toUpperCase()})</div>
            </CoinOption>
          ))}
        </CoinList>
        <div>
          <QuantityInput
            type="number"
            placeholder="수량"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="any"
          />
          <AddButton 
            type="submit"
            disabled={!selectedCoin || !quantity}
          >
            추가
          </AddButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default AddCoinForm;