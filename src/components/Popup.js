import { useState } from 'react';

function Popup(props) {
  const [onMouseDown, setOnMouseDown] = useState();

  function whereClicked(event) {
    return !event.target.closest('.popup__container');
  }

  function closeClickPopup(event) { //Если Up и Down произошли вне попапа или Up произошло на крестике
    if (whereClicked(event) && onMouseDown || event.target.closest('.popup__button-close')) props.closeAllPopups(); 
  }

  return (
    <div className="popup" onMouseDown={(e) => setOnMouseDown(whereClicked(e))} onMouseUp={closeClickPopup}>
      <div className="popup__container">
        <button className="button-close popup__button-close"></button>
        {props.children}
      </div>
    </div>
  );
}

export default Popup;