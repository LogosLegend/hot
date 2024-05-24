import WalletCardTableRow from './WalletCardTableRow.js';

export default function WalletCard(props) {
  const address = props.address;
  const account = props.account;
  const nearPrice = props.nearPrice;
  const usdBalance = account.nearBalance * nearPrice;
  const hotBalance = account.hotBalance;
  console.log(hotBalance)
  const transactions = account.transactions;
  const isArray = Array.isArray(transactions);

  function roundUsdBalance() {
    if (usdBalance < 100) {
      if (usdBalance < 1) {
        return +usdBalance.toFixed(2);
      }
      return +usdBalance.toFixed(1)
    }
    return +usdBalance.toFixed(0);
  }

  function roundHotBalance() {
    if (hotBalance < 100) {
      return +hotBalance.toFixed(2)
    }
    return +hotBalance.toFixed(1);
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
          <td className="account-table__cell">{roundUsdBalance() + '💲'}</td>
          <th className="account-table__cell" colSpan={2}>
            <a className="account-table__link" target="_blank" rel="noopener noreferrer" href={'https://nearblocks.io/address/' + address} title={address}>{props.setAddress(address)}</a>
          </th>
          <td className="account-table__cell">{'🔥' + roundHotBalance()}</td>
        </tr>
      </thead>
      <tbody className={`account-table__body ${!isArray && 'account-table__body_error'}`}>
      {isAnyTransactions()}
      </tbody>
    </table>
  );
}