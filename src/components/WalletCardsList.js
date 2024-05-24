import WalletCard from './WalletCard.js'

export default function WalletCardsList(props) {
  const accounts = props.accountData.accounts;
  const nearPrice = props.accountData.nearPrice;

  return (
    <>
      {Object.keys(accounts).map((address) => (
        <WalletCard
          key={address}
          address={address}
          setAddress={props.setAddress}
          account={accounts[address]}
          nearPrice={nearPrice}
        />
      ))}
    </>
  );
}