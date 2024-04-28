import { useState, useEffect } from 'react';
import WalletCard from './WalletCard.js'

function WalletCardList(props) {

  const arrayTransactions = props.transactions;

  return (
    <>
      {arrayTransactions.map((transaction) => (
        <WalletCard
          key={transaction.cursor}
          transactions={transaction.txns}
        />
      ))}
    </>
  );
}

export default WalletCardList;