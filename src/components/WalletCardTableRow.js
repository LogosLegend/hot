function WalletCardTableRow(props) {
  const transaction = props.transaction;
  const involved = transaction.involved_account_id || 'system';
  const tokenNumbers = parseFloat((transaction.delta_amount / 1e6).toFixed(3))
  const tokenImage = transaction.ft.icon;
  const transactionTime = transaction.block_timestamp;

  const nowTimeSeconds = Math.floor(Date.now() / 1000); // Преобразование в секунды
  const transactionTimeSeconds = Math.trunc(transactionTime / 1e9);
  const timeDifference = nowTimeSeconds - transactionTimeSeconds; //Разница

  function timeAgo() {
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

  function firedropNotification() {
    if (timeDifference < 1800) return involved === 'firedrop.hot.tg' ? 'account-table__firedrop' : 'account-table__claim';
  }

  return (
    <tr className={`account-table__row ${firedropNotification() || ''}`}>
      <td className="account-table__cell account-table__involved">{involved}</td>
      <td className="account-table__cell account-table__tokenNumbers">{tokenNumbers}</td>
      <td className="account-table__cell"><img className="account-table__img" src={tokenImage} alt="token"/></td>
      <td className="account-table__cell account-table__time">{timeAgo()}</td>
    </tr>
  );
}

export default WalletCardTableRow;