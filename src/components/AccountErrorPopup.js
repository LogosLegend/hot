export default function AccountErrorPopup(props) {
  function closeClickPopup(event) {
    props.setIsOpenErrorPopup(false);
  }

  return (
    <div className="account-error">
      <button className="button-close button-close__top-right account-error__button-close" onClick={closeClickPopup}></button>
      {'Не удалось получить информацию для следующих аккаунтов, попробуйте позже:\n' + props.errorAddresses.join('\n')}
    </div>
  );
}