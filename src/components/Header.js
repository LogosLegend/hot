import { useState, useEffect } from 'react';
import AddWalletsPopup from './AddWalletsPopup.js';
import DeleteWalletsPopup from './DeleteWalletsPopup.js';
import fire from '../images/fire.png';

function Header(props) {
  const accounts = props.accounts;
  const walletAddresses = props.walletAddresses;

  const [isOpenAddPopup, setIsOpenAddPopup] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

  useEffect(() => {
    if (isOpenAddPopup || isOpenDeletePopup) {
      document.addEventListener('keydown', handleEscClose);

      function handleEscClose(e) {

        if (e.key === 'Escape') {

          closeAllPopups();
          document.removeEventListener('keydown', handleEscClose);
        }
      }
    }

  }, [isOpenAddPopup, isOpenDeletePopup])

  function countingSumOfHot() {
    if (accounts !== undefined) {
      return +Object.keys(accounts).reduce((accumulator, account) => accumulator + +accounts[account].hotBalance, 0).toFixed(2);
    }
  }

  function handleAddPopupClick() {
    setIsOpenAddPopup(true)
  }

  function handleDeletePopupClick() {
    if (walletAddresses.length) {
      setIsOpenDeletePopup(true)
    }
  }

  function closeAllPopups() {
    setIsOpenAddPopup(false)
    setIsOpenDeletePopup(false)
  }

  return (
    <header className="header">
      <div className="header__buttons">
        <button className="header__button-momo"></button>
        <button className="header__button-add" onClick={handleAddPopupClick}></button>
        <button className="header__button-delete" disabled={!walletAddresses.length} onClick={handleDeletePopupClick}></button>
      </div>
      <div className="header__hot">
        <h1 className="header__title">HOT</h1>
        <img className="header__img" src={fire} alt="Иконка хот"/>
        <h2 className="header__subtitle">{countingSumOfHot()}</h2>
      </div>
      {isOpenAddPopup && <AddWalletsPopup closeAllPopups={closeAllPopups} addWalletAddresses={props.addWalletAddresses}/>}
      {isOpenDeletePopup && walletAddresses.length !== 0 && <DeleteWalletsPopup closeAllPopups={closeAllPopups} deleteWalletAddresses={props.deleteWalletAddresses} walletAddresses={walletAddresses}/>}
    </header>
  );
}

export default Header;