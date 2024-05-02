import { useState, useEffect } from 'react';
import Popup from './Popup.js';
import fire from '../images/fire.png';

function Header(props) {
  const accounts = props.accounts;

  const [disabled, setDisabled] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {

    if (isAddPopupOpen || isDeletePopupOpen) {
      document.addEventListener('keydown', handleEscClose);

      function handleEscClose(e) {

        if (e.key === 'Escape') {

          closeAllPopups();
          document.removeEventListener('keydown', handleEscClose);
        }
      }
    }

  }, [isAddPopupOpen, isDeletePopupOpen])

  function countingSumOfHot() {
    if (accounts !== undefined) {
      return +Object.keys(accounts).reduce((accumulator, account) => accumulator + +accounts[account].hotBalance, 0).toFixed(2);
    }
    return '';
  }

  function handleAddPopupClick() {
    setIsAddPopupOpen(true)
  }

  function handleDeletePopupClick() {
    setIsDeletePopupOpen(true)
  }

  function closeAllPopups() {
    setIsAddPopupOpen(false)
    setIsDeletePopupOpen(false)
  }

  function handleButtonDisabled() {
    setDisabled(true)
  }

  return (
    <header className="header">
      <div className="header__buttons">
        <button className="header__button-momo" disabled={disabled}></button>
        <button className="header__button-add" disabled={disabled} onClick={handleAddPopupClick}></button>
        <button className="header__button-delete" disabled={disabled} onClick={handleDeletePopupClick}></button>
      </div>
      <div className="header__hot">
        <h1 className="header__title">HOT</h1>
        <img className="header__img" src={fire} alt="Иконка хот"/>
        <h2 className="header__subtitle">{countingSumOfHot()}</h2>
      </div>
      {isAddPopupOpen && <Popup
        closeAllPopups={closeAllPopups}
        addWalletAddresses={props.addWalletAddresses}
      />}
    </header>
  );
}

export default Header;