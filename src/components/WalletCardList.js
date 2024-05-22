import WalletCard from './WalletCard.js'

export default function WalletCardList(props) {
  const accounts = props.accountData.accounts;
  const nearPrice = props.accountData.nearPrice;

  return (
    <>
      {Object.keys(accounts).map((address) => (
        <WalletCard
          key={address}
          address={address}
          account={accounts[address]}
          nearPrice={nearPrice}
        />
      ))}
    </>
  );
}