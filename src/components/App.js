import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header.js';
import WalletCardList from './WalletCardList.js';

function App() {
  const addresses = [
    'wallet.tg',
    'wallet2.tg',
    'wallet3.tg'
  ];

  const [nearPrice, setNearPrice] = useState([])
  const [nearNumbers, setNearNumbers] = useState([])
  const [tokens, setTokens] = useState([])
  const [accountData, setAccountData] = useState(JSON.parse(localStorage.getItem('accountData')) || {})

  useEffect(() => { //walletAddresses
    // if (addresses.length > 0) {
    //   getAllData(addresses).then((res) => {
    //     localStorage.setItem('accountData', JSON.stringify(res))
    //     setAccountData(res);
    //   })
    // }
  }, []);

  async function addWalletAddresses(WalletAddresses) {
    const newWalletAddresses = WalletAddresses.filter(address => {
      if (!Object.keys(accountData.accounts).includes(address)) {
        return address;
      }
    });

    if (newWalletAddresses.length > 0) {
      getAllData(newWalletAddresses).then(res => {
        localStorage.setItem('accountData', JSON.stringify(res))
        setAccountData(res);
        console.log(res);
      })
    }
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
    const object = {}
    object.nearBalance = (res[0].account[0].amount / 1000000000000000000000000); //10^24
    const tokens = res[1].inventory.fts;
    object.hotBalance = ((tokens.find(token => token.contract === 'game.hot.tg').amount) / 1000000); //10^6 - Поиск контракта с хот, получение кол-ва хота, преобразование в число с ,
    object.transactions = res[2].txns;
    return object;
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
        accounts={accountData.accounts}
        addWalletAddresses={addWalletAddresses}
      />
      <main className="content">
        {creatingWalletCards()}
      </main>
    </>
  );
}

export default App;