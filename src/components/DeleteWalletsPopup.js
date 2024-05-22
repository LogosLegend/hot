import Popup from './Popup.js';

export default function DeleteWalletsPopup(props) {
  const walletAddresses = props.walletAddresses;

  return (
    <Popup closeAllPopups={props.closeAllPopups}>
      <ul className="popup__addresses">
        {walletAddresses.map((address) => (
          <li key={address} className="popup__address-container">
            <p className="popup__address">{address}</p>
            <button className="button-close popup__button-delete" onClick={() => props.deleteWalletAddresses(address)}></button>
          </li>
        ))}
     </ul>
    </Popup>
  );
}