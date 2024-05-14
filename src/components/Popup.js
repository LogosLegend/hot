import { useState, useEffect } from 'react';

function Popup(props) {

  const placeholder = "Вставьте адреса кошельков, в формате @wallet, wallet или wallet.tg, разделённые пробелом или переносом строки";
  const regexWordSeparator = /\s+|\S+/g;
  const regexSpaceChar = /\s+/;
  const regexError = /^@?[A-Za-z0-9_]{5,32}(\.tg)?$/;
  const regexErrorSyntax = /^@?[A-Za-z0-9_]+(\.tg)?$/;

  const [addresses, setAddresses] = useState([]);
  const [onMouseDown, setOnMouseDown] = useState();

  const [errorClassSyntax, setErrorClassSyntax] = useState('');
  const [errorClassLength, setErrorClassLength] = useState('');

  function handleChange(e) {
    const text = e.target.value;
    let processedText = []; //Текст, преобразованный в массив с отображением ошибок

    const errValues = { //Объект с классами ошибок
      'syntax': '',
      'length': '',
      'bot': ''
    };

    let match;
    while (match = regexWordSeparator.exec(text)) { //Разделение текста на слова и пробельные символы
      const matchText = match[0];

      const checkingSpaceChar = !regexSpaceChar.test(matchText); //Проверка на пробел
      const checkingError = !regexError.test(matchText); //Проверка на ошибку в слове

      if (checkingError && checkingSpaceChar) {
        processedText.push(
          <span key={`error-${regexWordSeparator.lastIndex}`} className={WhatMistake(matchText, errValues)}>
            {matchText}
          </span>
        );
      } else {
        processedText.push(matchText);
      }
    }

    if (text[text.length - 1] === '\n') processedText.push(<br key={0} />) //Если последний символ является переносом строки, то он не будет добавлен, для этого нужен br

    const content = <p className="popup__textare-copy-text">{processedText}</p>;

    if (errValues.syntax) errValues.bot = ' popup__error-length-bot'; //Ошибка длины может быть 1 или 2 блоком, во 2 случае нужен класс

    setAddresses(content)
    setErrorClassSyntax(errValues.syntax);
    setErrorClassLength(errValues.length + errValues.bot);
  }

  function WhatMistake(matchText, errValues) {
    const checkingErrorSyntax = !regexErrorSyntax.test(matchText);

    if (checkingErrorSyntax) {
      errValues.syntax = 'popup__error_visible';
      return 'span-error_syntax';
    }
    errValues.length = 'popup__error_visible';
    return 'span-error_length';
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
          <div className="popup__errors">
            <span className={`popup__error popup__error-syntax ${errorClassSyntax}`}>🟥 Адрес может содержать символы a-z, 0-9 и _</span>
            <span className={`popup__error popup__error-length ${errorClassLength}`}>🟧 Длина адреса должна быть от 5 до 32 символов</span>
          </div>
          <button className="popup__button-submit" type="submit">Сохранить</button>
        </form>
      </div>
    </div>
  );
}

export default Popup;