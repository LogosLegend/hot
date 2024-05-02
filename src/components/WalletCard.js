import { useState, useEffect } from 'react';
import WalletCardTableRow from './WalletCardTableRow.js';

function WalletCard(props) {

  const address = props.address;
  const account = props.account;
  const nearPrice = props.nearPrice;
  const usdBalance = +(account.nearBalance * nearPrice).toFixed(2);
  const hotBalance = +account.hotBalance.toFixed(2);
  const transactions = account.transactions;

  return (
    <>
      <table className="account-table">
        <thead className="account-table__head">
          <tr className="account-table__row">
            <td className="account-table__cell">{usdBalance + '💲'}</td>
            <th className="account-table__cell" colspan="2">
              <a className="account-table__link" target="_blank" rel="noopener noreferrer" href={'https://nearblocks.io/address/' + address}>{address}</a>
            </th>
            <td className="account-table__cell">{'🔥' + hotBalance}</td>
          </tr>
        </thead>
        <tbody className="account-table__body">
          {transactions.map((transaction, i) => (
            <WalletCardTableRow
              key={i}
              transaction={transaction}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default WalletCard;