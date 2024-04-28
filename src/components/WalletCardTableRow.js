import { useState, useEffect } from 'react';

function WalletCardTableRow(props) {

  const transaction = props.transaction;
  const involved = transaction.involved_account_id || 'system';
  const tokenNumbers = transaction.delta_amount;
  const tokenImage = transaction.ft.icon;
  const transactionTime = transaction.block_timestamp;

  const date = new Date();
  const nowTimeSeconds = Math.floor(date.getTime() / 1000); // Преобразование в секунды
  const transactionTimeSeconds = Math.trunc(transactionTime / 1000000000);
  const timeDifference = nowTimeSeconds - transactionTimeSeconds; //Разница

  function timeAgo() { //1713870399394658715 timestamp

    if (timeDifference > 86400) { //Транзакция совершена больше дня назад
      return `${Math.round(timeDifference / (86400))} д`;
    }

    if (timeDifference > 3600) { //Транзакция совершена больше часа назад
      return `${Math.round(timeDifference / 3600)} ч`;
    }

    if (timeDifference < 3600) { //Транзакция совершена меньше часа назад
      return `${Math.round(timeDifference / 60)} м`;
    }
  }

  function roundingCreditedAssets() {
    return parseFloat((tokenNumbers / 1000000).toFixed(3))
  }

  function firedropNotification() {
    if (involved === 'firedrop.hot.tg' && timeDifference < 600) {
      return 'account-table__firedrop';
    }
  }

  return (
    <tr className={`account-table__row ${firedropNotification()}`}>
      <td className="account-table__cell account-table__involved">{involved}</td>
      <td className="account-table__cell account-table__tokenNumbers">{roundingCreditedAssets()}</td>
      <td className="account-table__cell"><img className="account-table__img" src={tokenImage} alt="token-image"/></td>
      <td className="account-table__cell account-table__time">{timeAgo()}</td>
    </tr>
  );
}

export default WalletCardTableRow;