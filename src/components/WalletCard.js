import { useState, useEffect } from 'react';
import WalletCardTableRow from './WalletCardTableRow.js';

function WalletCard(props) {

  return (
    <>
      <table className="account-table">
        <thead className="account-table__head">
          <tr className="account-table__row">
            <th className="account-table__cell">14 $</th>
            <th className="account-table__cell" colspan="2"><a className="account-table__link" href="#">wallet.tg</a></th>
            <th className="account-table__cell">5 $</th>
          </tr>
        </thead>
        <tbody className="account-table__body">
          {props.transaction.map((transaction) => (
            <WalletCardTableRow
              transaction={transaction}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default WalletCard;