import { useState } from 'react';

function Popup(props) {

  const placeholder = "Вставьте адреса кошельков, в формате @wallet, wallet или wallet.tg, разделённые пробелом или переносом строки"

  const [addresses, setAddresses] = useState('');
  const [onMouseDown, setOnMouseDown] = useState();

  function handleChange(e) {
    setAddresses(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // setFieldDisabled(true)

    const walletAddresses = addresses.toLowerCase().split(/\s+/).filter(i => i);
    console.log(walletAddresses)
  }

  function whereOccurredOnMouseDown(event) {
    event.target.closest('[class*="container"]') ? setOnMouseDown(false) : setOnMouseDown(true)
  }

  function closeClickPopup(event) { //Если событие Up произошло на крестике или вне попапа и событие Down произошло не в попапе
    if (event.target.closest('.popup__button-close') || !event.target.closest('[class*="container"]') && onMouseDown) props.closeAllPopups(); 
  }

  return (
    <div className="popup" onMouseDown={whereOccurredOnMouseDown} onMouseUp={closeClickPopup}>
      <div className="popup__container">
        <button className="popup__button-close"></button>
        <form className="popup__form" action="#" name="hot-form" onSubmit={handleSubmit}>
          <div className="popup__textarea-container">
            <textarea className="popup__textarea" type="text" name="addresses" onChange={handleChange} placeholder={placeholder}></textarea>
          </div>
          <span className={`error visible`}>Адрес может содержать только английские буквы, цифры и точку, а также быть не короче 5 и не длинее 32 символов</span>
          <button className="popup__button-submit" type="submit">Сохранить</button>
        </form>
      </div>
    </div>
  );
}

export default Popup;