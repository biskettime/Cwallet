import React from "react";
import Coin from "./Coin";

const CoinList = ({ coins, onRemove }) => {
  return (
    <div>
      {coins.map((coin, index) => (
        <Coin key={index} coin={coin} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default CoinList;