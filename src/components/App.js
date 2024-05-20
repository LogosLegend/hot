import { useState } from 'react';
import Header from './Header.js';
import WalletCardList from './WalletCardList.js';

function App() {
  const localStorageWalletAddresses = localStorage.getItem('walletAddresses');
  const [walletAddresses, setWalletAddresses] = useState(localStorageWalletAddresses ? JSON.parse(localStorageWalletAddresses) : [])
  
  const localStorageAccountData = localStorage.getItem('accountData');
  const [accountData, setAccountData] = useState(localStorageAccountData ? JSON.parse(localStorageAccountData) : {})
  
  const messageIsNoTransactions = 'Транзакций нет';
  const messageIsNoAddress = 'Адрес не существует';

  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [preloaderHide, setPreloaderHide] = useState(true);

  function deleteWalletAddresses(address) {
    const newWalletAddresses = walletAddresses.filter(e => e !== address);
    localStorage.setItem('walletAddresses', JSON.stringify(newWalletAddresses))
    setWalletAddresses(newWalletAddresses)

    const {accounts: {[address]: deleteAddress, ...restAddresses}, ...restData} = accountData;
    const newAccountData = {accounts: restAddresses, ...restData}
    localStorage.setItem('accountData', JSON.stringify(newAccountData))
    setAccountData(newAccountData)
  }

  async function addWalletAddresses(addresses) {
    const newWalletAddresses = addresses.filter(address => !walletAddresses.includes(address));

    const updateWalletAddresses = walletAddresses.concat(newWalletAddresses);
    localStorage.setItem('walletAddresses', JSON.stringify(updateWalletAddresses));
    setWalletAddresses(updateWalletAddresses);

    if (newWalletAddresses.length > 0) setData(newWalletAddresses);
  }

  function setData(addresses) {
    setPreloaderHide(false);
    setButtonsDisabled(true);
    getAllData(addresses).then(res => {
      localStorage.setItem('accountData', JSON.stringify(res))
      setAccountData(res);
      setPreloaderHide(true);
      setButtonsDisabled(false);
    })
  }

  async function getAllData(addresses) {
    const data = {
      nearPrice: await nearPriceRequest(),
      timestamp: Date.now(),
      accounts: {
        ...accountData.accounts,
        ...await getDataAllProfiles(addresses)
      }
    }
    return data;
  }

  async function getDataAllProfiles(addresses) {
    let data = {};

    for (let i = 0; i < addresses.length; i++) {
      await sleep(350 * i)
      data = {
        ...data,
        [addresses[i]]: await dataRequest(addresses[i]) //Создание аккаунта с данными
      }
    }
    return data
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function dataRequest(address) {
    return Promise.all([
      fetch(`https://api3.nearblocks.io/v1/account/${address}`).then((res) => checkResult(res)),
      fetch(`https://api3.nearblocks.io/v1/account/${address}/inventory`).then((res) => checkResult(res)),
      fetch(`https://api3.nearblocks.io/v1/account/${address}/ft-txns?order=desc&page=1&per_page=4`).then((res) => checkResult(res))
    ]).then(res => {
      return addProfileData(res, address)
    });
  }

  function addProfileData(res, address) {    
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

  function nearPriceRequest() {
    return fetch('https://api3.nearblocks.io/v1/stats').then((res) => checkResult(res)).then(res => {return +res.stats[0].near_price})
  }
  
  function checkResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
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
        walletAddresses={walletAddresses}
        addWalletAddresses={addWalletAddresses}
        deleteWalletAddresses={deleteWalletAddresses}
        reload={setData}
        buttonsDisabled={buttonsDisabled}
      />
      <main className="content">
        <div className={`preloader ${preloaderHide ? 'preloader_hidden' : ''}`}>
          <div className="preloader__circle"></div>
        </div>
        {creatingWalletCards()}
      </main>
    </>
  );
}

export default App;