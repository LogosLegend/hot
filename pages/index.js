const accounts = [
  'wallet.tg',
  'wallet2.tg',
  'wallet3.tg'
];



function creatingQueries(data) {

  return fetch(`https://api3.nearblocks.io/v1/account/${data}/ft-txns?order=desc&page=1&per_page=5`).then((res) => checkResult(res))
}

function checkResult(res) {
  
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(res.status);
}

function getDataAll() {

  const promises = [];

  for (let i = 0; i < accounts.length; i++) {
  	promises.push(creatingQueries(accounts[i]))
  }
  console.log(promises);

  return Promise.all(promises);
}