import { useState, useEffect } from 'react';
import AddWalletsPopup from './AddWalletsPopup.js';
import DeleteWalletsPopup from './DeleteWalletsPopup.js';
import fire from '../images/fire.png';

function Header(props) {
  const accountData = props.accountData;
  const accountAddresses = accountData ? Object.keys(accountData) : [];
  const walletAddresses = props.walletAddresses;

  const isWalletAddressesExist = accountAddresses.length;
  const isButtonsDisabled = !isWalletAddressesExist || props.buttonsDisabled;
  console.log(isButtonsDisabled)
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
    if (isWalletAddressesExist) {
      return +accountAddresses.reduce((accumulator, account) => accumulator + +accountData[account].hotBalance, 0).toFixed(2);
    }
  }

  function handleReloadClick() {
    if (!isButtonsDisabled) {
      props.reload(walletAddresses);
    }
  }

  function handleAddPopupClick() {
    if (!isButtonsDisabled) setIsOpenAddPopup(true);
  }

  function handleDeletePopupClick() {
    if (!isButtonsDisabled) setIsOpenDeletePopup(true);
  }

  function closeAllPopups() {
    setIsOpenAddPopup(false)
    setIsOpenDeletePopup(false)
  }

  return (
    <header className="header">
      <div className="header__buttons">
        <button className="header__button header__button-reload" disabled={isButtonsDisabled} onClick={handleReloadClick}></button>
        <button className="header__button header__button-add" disabled={isButtonsDisabled} onClick={handleAddPopupClick}></button>
        <button className="header__button header__button-delete" disabled={isButtonsDisabled} onClick={handleDeletePopupClick}></button>
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