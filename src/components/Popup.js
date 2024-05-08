import { useState, useEffect } from 'react';

function Popup(props) {

  const placeholder = "Вставьте адреса кошельков, в формате @wallet, wallet или wallet.tg, разделённые пробелом или переносом строки"

  const [addresses, setAddresses] = useState([]);
  const [onMouseDown, setOnMouseDown] = useState();

  function handleChange(e) {
    const value = e.target.value.split('\n').map((str, i) => {
      const strArr = str.split(/\s+/).filter(i => i);

      if (!strArr.length) {
        return <p key={`line-${i}`} className="popup__textare-copy-text">{str}</p>
      } else {
        const errStr = strArr.filter(str => !/^@?[A-Za-z0-9]+(\.tg)?$/.test(str));

        let newStr = [str];
        let aboba = [];
        for (let j = 0; j < errStr.length; j++) {
          console.log(errStr)
          newStr = newStr[newStr.length - 1].split(errStr[j], 2)
          console.log(newStr)
          aboba.push(newStr[0], <span key={`line-${i}-err-${j}`} className="popup__error">{errStr[j]}</span>)
          if (j === errStr.length - 1) { aboba.push(newStr[newStr.length - 1]) }
        }
        console.log(aboba)
        return <p key={`line-${i}`} className="popup__textare-copy-text">{aboba}</p>
      }
    }
    ); //Создание массива из подготовленных для вставки элементов
    setAddresses(value)
  }

  function handleSubmit(e) {
    e.preventDefault();

    const walletAddresses = addresses.toLowerCase().split(/\s+/).filter(i => i);
    console.log(walletAddresses)
  }

  function whereOccurredOnMouseDown(event) {
    event.target.closest('[class*="container"]') ? setOnMouseDown(false) : setOnMouseDown(true)
  }

  function closeClickPopup(event) { //Если событие Up произошло на крестике или вне попапа и событие Down произошло не в попапе
    if (event.target.closest('.popup__button-close') || !event.target.closest('[class*="container"]') && onMouseDown) props.closeAllPopups(); 
  }

  useEffect(() => {
    document.querySelector('.popup__textarea').addEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    const scrollY = document.querySelector('.popup__textarea').scrollTop;
    document.querySelector('.popup__textarea-copy').scrollTo(0, scrollY);
  };

  return (
    <div className="popup" onMouseDown={whereOccurredOnMouseDown} onMouseUp={closeClickPopup}>
      <div className="popup__container">
        <button className="popup__button-close"></button>
        <form className="popup__form" action="#" name="hot-form" onSubmit={handleSubmit}>
          <div className="popup__textarea-container">
            <div className="popup__textarea-copy">{addresses}</div>
            <textarea className="popup__textarea" type="text" name="addresses" onChange={handleChange} placeholder={placeholder} spellcheck="false"></textarea>
          </div>
          <span className={`error visible`}>Адрес может содержать только английские буквы, цифры и точку, а также быть не короче 5 и не длинее 32 символов</span>
          <button className="popup__button-submit" type="submit">Сохранить</button>
        </form>
      </div>
    </div>
  );
}

export default Popup;