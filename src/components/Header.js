import { useState, useEffect } from 'react';
import AddWalletsPopup from './AddWalletsPopup.js';
import DeleteWalletsPopup from './DeleteWalletsPopup.js';
import fire from '../images/fire.png';

export default function Header(props) {
  const accountData = props.accountData;
  const walletAddresses = accountData ? Object.keys(accountData) : [];

  const isWalletAddressesExist = walletAddresses.length;
  const buttonsDisabled = props.buttonsDisabled;
  const isButtonsDisabled = !isWalletAddressesExist || buttonsDisabled;

  const setIsOpenErrorPopup = props.setIsOpenErrorPopup;
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
      return +Object.keys(accountData).reduce((accumulator, account) => accumulator + +accountData[account].hotBalance, 0).toFixed(2);
    }
  }

  function handleReloadClick() {
    if (!isButtonsDisabled) {
      setIsOpenErrorPopup(false);
      props.reload(walletAddresses);
    }
  }

  function handleAddPopupClick() {
    if (!buttonsDisabled) {
      setIsOpenErrorPopup(false);
      setIsOpenAddPopup(true);
    }
  }

  function handleDeletePopupClick() {
    if (!isButtonsDisabled) {
      setIsOpenErrorPopup(false);
      setIsOpenDeletePopup(true);
    }
  }

  function closeAllPopups() {
    setIsOpenAddPopup(false)
    setIsOpenDeletePopup(false)
  }

  return (
    <header className="header">
      <div className="header__buttons">
        <button className="header__button header__button-reload" disabled={isButtonsDisabled} onClick={handleReloadClick}></button>
        <button className="header__button header__button-add" disabled={buttonsDisabled} onClick={handleAddPopupClick}></button>
        <button className="header__button header__button-delete" disabled={isButtonsDisabled} onClick={handleDeletePopupClick}></button>
      </div>
      <div className="header__hot">
        <h1 className="header__title">HOT</h1>
        <img className="header__img" src={fire} alt="Иконка хот"/>
        <h2 className="header__subtitle">{countingSumOfHot()}</h2>
      </div>
      {isOpenAddPopup && <AddWalletsPopup closeAllPopups={closeAllPopups} addWalletAddresses={props.addWalletAddresses}/>}
      {isOpenDeletePopup && isWalletAddressesExist !== 0 && <DeleteWalletsPopup closeAllPopups={closeAllPopups} deleteWalletAddresses={props.deleteWalletAddresses} walletAddresses={walletAddresses}/>}
    </header>
  );
}