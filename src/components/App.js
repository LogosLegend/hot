import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header.js';
import WalletCardList from './WalletCardList.js';

function App() {
  // const accountData = {
  //   'wallet.tg': {
  //     'nearBalance': 11,
  //     'hotBalance': 11,
  //     'transactions': {},
  //   },
  // };

  const addresses = [
    'wallet.tg',
    'wallet2.tg',
    'wallet3.tg'
  ];

  localStorage.setItem('walletAddresses', JSON.stringify(addresses))

  const [nearPrice, setNearPrice] = useState([])
  const [nearNumbers, setNearNumbers] = useState([])
  const [tokens, setTokens] = useState([])
  const [transactions, setTransactions] = useState([])
  const [ara, setAra] = useState({})

  const walletAddresses = JSON.parse(localStorage.getItem('walletAddresses'));

  useEffect(() => {
    if (localStorage.getItem('accountData') === null) {
      walletAddresses.map((address) => {
        dataRequest(address).then(res => {
          setAra((prev) => ({...prev, ['accounts']: { ...prev['accounts'], [address]:res } } ) )
      })
        
      })
    } else {
      // console.log((JSON.parse(localStorage.getItem('accountData'))).accounts[0])
    }
 }, []);

  useEffect(() => {
    localStorage.setItem('accountData', JSON.stringify(ara))
    console.log(ara)
 }, [ara]);
  

    function dataRequest(address) {
      return Promise.all([
        fetch(`https://api3.nearblocks.io/v1/account/${address}`).then((res) => checkResult(res)),
        fetch(`https://api3.nearblocks.io/v1/account/${address}/inventory`).then((res) => checkResult(res)),
        fetch(`https://api3.nearblocks.io/v1/account/${address}/ft-txns?order=desc&page=1&per_page=4`).then((res) => checkResult(res))
      ]).then(res => {
        return addData(res, address)
      });
    }

    function addData(res, address) {
      const object = {}
      object.nearBalance = (res[0].account[0].amount / 1000000000000000000000000).toFixed(4); //10^24
      const tokens = res[1].inventory.fts;
      object.hotBalance = ((tokens.find(token => token.contract === 'game.hot.tg').amount) / 1000000).toFixed(2); //10^6 - Поиск контракта с хот, получение кол-ва хота, преобразование в значение с двумя знаками после ,
      object.transactions = res[2].txns;
      return object;
    }


  async function creatingNearPriceRequest() {
    return await fetch('https://api3.nearblocks.io/v1/stats').then((res) => checkResult(res))
  }

  function creatingNearNumberRequests(account) {
    return fetch(`https://api3.nearblocks.io/v1/account/${account}`).then((res) => checkResult(res))
  }

  function creatingTokenRequests(account) {
    return fetch(`https://api3.nearblocks.io/v1/account/${account}/inventory`).then((res) => checkResult(res))
  }

  function creatingTransactionRequests(account) {
    return fetch(`https://api3.nearblocks.io/v1/account/${account}/ft-txns?order=desc&page=1&per_page=4`).then((res) => checkResult(res))
  }

  
  function checkResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }
  
  function getDataAll(func) {
    const promises = [];
  
    for (let i = 0; i < addresses.length; i++) {
      promises.push(func(addresses[i]))
    }
    return Promise.all(promises);
  }




  return (
    <>
      <Header/>
      <main className="content">
        <WalletCardList
          nearPrice={nearPrice}
          nearNumbers={nearNumbers}
          tokens={tokens}
          transactions={transactions}
        />
      </main>
    </>
  );
}

export default App;