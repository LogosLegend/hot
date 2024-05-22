import WalletCardTableRow from './WalletCardTableRow.js';

export default function WalletCard(props) {
  const address = props.address;
  const account = props.account;
  const nearPrice = props.nearPrice;
  const usdBalance = +(account.nearBalance * nearPrice).toFixed(2);
  const hotBalance = +account.hotBalance.toFixed(2);
  const transactions = account.transactions;
  const isArray = Array.isArray(transactions);

  function setAddress() {
    return address.length > 15 ? address.replace(address.substring(6, address.length - 6), "...") : address; //Длинный адрес будет превращён в abcdef...uvwxyz.tg;
  }

  function isAnyTransactions() {
    if (isArray) {
      return transactions.map((transaction, i) => (
        <WalletCardTableRow
          key={i}
          transaction={transaction}
        />
      ))
    } else {
      return (
        <tr>
          <td>
            <p className="account-table__notification_error">{transactions}</p>
          </td>
        </tr>
      )
    }
  }

  return (
    <table className="account-table">
      <thead className="account-table__head">
        <tr className="account-table__row">
          <td className="account-table__cell">{usdBalance + '💲'}</td>
          <th className="account-table__cell" colSpan={2}>
            <a className="account-table__link" target="_blank" rel="noopener noreferrer" href={'https://nearblocks.io/address/' + address} title={address}>{setAddress()}</a>
          </th>
          <td className="account-table__cell">{'🔥' + hotBalance}</td>
        </tr>
      </thead>
      <tbody className={`account-table__body ${!isArray && 'account-table__body_error'}`}>
      {isAnyTransactions()}
      </tbody>
    </table>
  );
}