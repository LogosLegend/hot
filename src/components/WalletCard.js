import { useState, useEffect } from 'react';
import WalletCardTableRow from './WalletCardTableRow.js';

function WalletCard(props) {

  const address = props.address;
  const account = props.account;
  const nearPrice = props.nearPrice;
  const usdBalance = +(account.nearBalance * nearPrice).toFixed(2);
  const hotBalance = +account.hotBalance.toFixed(2);
  const transactions = account.transactions;

  function setAddress() {
    if (address.length > 15) {
      return address.replace(address.substring(6, address.length - 6), "..."); //Длинный адрес будет превращён в abcdef...uvwxyz.tg;
    }
    return address;
  }

  function isAnyTransactions() {
    if (Array.isArray(transactions)) {
      return (
        <tbody className="account-table__body">
          {transactions.map((transaction, i) => (
            <WalletCardTableRow
              key={i}
              transaction={transaction}
            />
          ))}
        </tbody>
      )
    } else {
      return (
        <tbody className="account-table__body account-table__body_error">
          <tr>
            <td>
              <p className="account-table__notification_error">{transactions}</p>
            </td>
          </tr>
        </tbody>
      )
    }
  }

  return (
    <>
      <table className="account-table">
        <thead className="account-table__head">
          <tr className="account-table__row">
            <td className="account-table__cell">{usdBalance + '💲'}</td>
            <th className="account-table__cell" colspan="2">
              <a className="account-table__link" target="_blank" rel="noopener noreferrer" href={'https://nearblocks.io/address/' + address} title={address}>{setAddress()}</a>
            </th>
            <td className="account-table__cell">{'🔥' + hotBalance}</td>
          </tr>
        </thead>
        {isAnyTransactions()}
      </table>
    </>
  );
}

export default WalletCard;