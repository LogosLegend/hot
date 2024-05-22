import { useState } from 'react';
import Header from './Header.js';
import WalletCardList from './WalletCardList.js';
import AccountErrorPopup from './AccountErrorPopup.js';

export default function App() {
  const localStorageAccountData = localStorage.getItem('accountData');
  const [accountData, setAccountData] = useState(localStorageAccountData ? JSON.parse(localStorageAccountData) : {})
  
  const messageIsNoTransactions = 'Транзакций нет';
  const messageIsNoAddress = 'Адрес не существует';

  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(false);

  const [isOpenErrorPopup, setIsOpenErrorPopup] = useState(false);
  const [errorAddresses, setErrorAddresses] = useState([]);

  function deleteWalletAddresses(address) {
    const {accounts: {[address]: deleteAddress, ...restAddresses}, ...restData} = accountData; //Удаление адреса с помощью деструктурирующего присваивания
    //Объявляются 3 переменные {}, deleteAddress - адрес который удаляется, restAddresses - остальные адреса, restData - остальные данные
    const newAccountData = {accounts: restAddresses, ...restData}
    //Формируется объект, без deleteAddress.

    localStorage.setItem('accountData', JSON.stringify(newAccountData))
    setAccountData(newAccountData)
  }

  async function addWalletAddresses(addresses) {
    const walletAddresses = accountData.accounts ? Object.keys(accountData.accounts) : [];
    const newWalletAddresses = addresses.filter(address => !walletAddresses.includes(address)); //Проверка на существующие одинаковые значения

    if (newWalletAddresses.length > 0) setData(newWalletAddresses);
  }

  function setData(addresses) {
    setIsPreloaderVisible(true);
    setButtonsDisabled(true);

    getAllData(addresses).then(res => {
      localStorage.setItem('accountData', JSON.stringify(res))
      setAccountData(res);

      setIsPreloaderVisible(false);
      setButtonsDisabled(false);
    })
  }

  async function getAllData(addresses) { //Формирование объекта со всеми данными
    const nearPrice = await nearPriceRequest().then(res => {return res.stats[0].near_price}).catch(() => {return accountData.nearPrice || 0});
    const data = {
      nearPrice: nearPrice,
      accounts: {
        ...accountData.accounts,
        ...await getDataAllProfiles(addresses)
      }
    }
    return data;
  }

async function getDataAllProfiles(addresses) { //Сбор данных всех адресов в 1 объект
  let data = {};
  let error = [];

  async function assemblingData(i) {
    try {
      const res = await requestData(addresses[i]);
      data = {
        ...data,
        [addresses[i]]: res
      };
    } catch (err) {
      error.push(addresses[i]);
    }
  };

  for (let i = 0; i < addresses.length; i++) {
    await sleep(500); //Обязательная задержка, иначе будет 429
    await assemblingData(i);
  }

  if (error.length) {
    setErrorAddresses(error);
    setIsOpenErrorPopup(true);
  }

  return data;
}

  function sleep(ms) { //Задержка
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function requestData(address) { //Получение данных адреса
    return Promise.all([
      fetch(`https://api3.nearblocks.io/v1/account/${address}`).then((res) => checkResult(res)),
      fetch(`https://api3.nearblocks.io/v1/account/${address}/inventory`).then((res) => checkResult(res)),
      fetch(`https://api3.nearblocks.io/v1/account/${address}/ft-txns?order=desc&page=1&per_page=4`).then((res) => checkResult(res))
    ]).then(res => {
      return addProfileData(res, address)
    })
  }

  function addProfileData(res, address) { //Формирование объекта с необходимыми данными адреса
    const data = {
      nearBalance: 0,
      hotBalance: 0,
      transactions: messageIsNoAddress
    };

    const isEmptyRes = Object.keys(res[0].account[0]).length;

    if (isEmptyRes) {
      data.nearBalance = res[0].account[0].amount / 1e24;
      const hotToken = res[1].inventory.fts.find(token => token.contract === 'game.hot.tg'); //Поиск контракта с хот
      data.hotBalance = (hotToken ? hotToken.amount : 0) / 1e6; //Получение кол-ва хота, преобразование в число с ,
      data.transactions = res[2].txns.length ? res[2].txns : messageIsNoTransactions;
    }
    return data;
  }

  function nearPriceRequest() { //Получение текущей цены near
    return fetch('https://api3.nearblocks.io/v1/stats').then((res) => checkResult(res))
  }
  
  function checkResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }

  function creatingPreloader() {
    if (isPreloaderVisible) {
      return (
        <div className="preloader">
          <div className="preloader__circle"></div>
        </div>
      )
    }
  }

  function creatingAccountError() {
    if (isOpenErrorPopup) {
      return <AccountErrorPopup setIsOpenErrorPopup={setIsOpenErrorPopup} errorAddresses={errorAddresses}/>
    }
  }

  function creatingWalletCards() {
    if (Object.keys(accountData).length) {
      return <WalletCardList accountData={accountData}/>
    }
  }

  return (
    <>
      <Header
        accountData={accountData.accounts}
        addWalletAddresses={addWalletAddresses}
        deleteWalletAddresses={deleteWalletAddresses}
        reload={setData}
        buttonsDisabled={buttonsDisabled}
        setIsOpenErrorPopup={setIsOpenErrorPopup}
      />
      <main className="content">
        {creatingPreloader()}
        {creatingAccountError()}
        {creatingWalletCards()}
      </main>
    </>
  );
}