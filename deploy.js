const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require ('./compile.js');

const provider = new HDWalletProvider(
    // mnemonic from MetaMask
    'your metamask 12 mnemonic words',

    //APIKEY from Infura.io which runs a ethereum node on the Rinkeby Network
    'your infura api key for rinkeby testnet'
)

// take provider and pass the Web3 constructer and get instance of web3
const web3 = new Web3(provider);


const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0]});
       
    console.log('Contract deployed to:', result.options.address);
};

deploy();
