const assert = require('assert'); //helper library from node standard library.
const ganache = require('ganache-cli'); //ganache is the local ethereum Testnet, only gets created when we start running tests
const Web3 = require('web3'); // Web3 - only taking in constructer function. I.e. capital "W"
const web3 = new Web3(ganache.provider()); //creating an instance of web3, passing in new ganache.provider(). Note: provider allows us to connect to any given network.

//require in the interface (ABI of contract & bytecode: raw compiled contract) - from compile.js
// curly braces because we are requiring in object that has the interface and bytecode properties
const {interface, bytecode} = require('../compile.js');

let lottery; // instance of contract
let accounts; // auto generated unlocked accounts from ganache-cli   

//beforeEach runs for each test
beforeEach( async () => {

    //asynchronous code that assigns array of generated accounts to the declared accounts variable.
    accounts = await web3.eth.getAccounts();

    //asynchronous code that takes instance of contract by passing in the parsed interface of contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode}) // passing in the raw compiled bytecode from compiler
        .send({ from: accounts[0], gas: '1000000' }) // account to use for deployment | specify gas limit to be used for deployment
});

// Top level describe statement
describe('Lottery Contract', () => {

    //Case:0001
    //test case that tests the deployment of contract
    it('deploys a contract', () => {
        assert.ok(lottery.options.address); // checks if contract has address.
    })

    //Case:0002
    //Test to check if a players address gets captured in the contracts: players array
    it('allows one accounts to enter', async () => {
        await lottery.methods.enterLottery().send({ //call send method on enterLottery function
            from: accounts[0], // pass in the sender account
            value: web3.utils.toWei('0.02', 'ether') // pass in the ether we want to send | Using web3 utils toWei conversion helper
        });

        //call getPlayers method in contract to retrieve the list of captured players in the players array.
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0] // account making the call
        });

        assert.strictEqual(accounts[0], players[0]); // check if account at index 0 equals account passed back from deployed contract
        assert.strictEqual(1, players.length); // check if there is only 1 player entered in competition.
    });

    //Case: 0003
    //Checks if multiple accounts can enter the lottery
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enterLottery().send({ //call send method on enterLottery function
            from: accounts[0], // pass in the sender account
            value: web3.utils.toWei('0.02', 'ether') // pass in the ether we want to send | Using web3 utils toWei conversion helper
        });

        await lottery.methods.enterLottery().send({ //call send method on enterLottery function
            from: accounts[1], // pass in the sender account
            value: web3.utils.toWei('0.02', 'ether') // pass in the ether we want to send | Using web3 utils toWei conversion helper
        });

        await lottery.methods.enterLottery().send({ //call send method on enterLottery function
            from: accounts[2], // pass in the sender account
            value: web3.utils.toWei('0.02', 'ether') // pass in the ether we want to send | Using web3 utils toWei conversion helper
        });

        //call getPlayers method in contract to retrieve the list of captured players in the players array.
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0] // account making the call
        });

        assert.strictEqual(accounts[0], players[0]); // check if account at index 0 equals account passed back from deployed contract
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(3, players.length); // check if there is only 1 player entered in competition.
    });

    //Case: 0004
    //Checks the minimum value to enter functionality
    it('requires minimum of ether to enter', async () => {
        try {
            await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: 0 // send innsufficient ammount of funds to enter
        });
        assert(false); //checks to see if false: test should fail as insufficient funds were sent.
    } catch (err) {
        assert(err); //checks to see if there is an error present.
    }
    });

    //Case:00005
    //Checks the priviledges are applied to restrict only the contract creater: manager can trigger the pick winner function.
    it('only manager can pick winner', async () => {
        try {
            await lottery.methods.pickWinner().call({
                from: accounts[1] // invokes the pickWinners function with an account other than the contract creator account.
            });
        assert(false); // fail test if the call succeeds
        } catch (err) {
            assert(err); // pass test as an error occurred.
        }
    });

    //Case: 0006
    // Verify that 1. winner receieves money, 2. resets the players array, 3. Contracts address balance is zero
    it('sends money to winner, resets players array & contracts account is zero', async () => {
        
        // address @ index 0 in accounts sends 2 ether to enter competition
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        //Store accounts[0] ether balance
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        //Manager accounts[0] invokes pickWinner function
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        //captures balance after accounts receives lottery
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        //Calculate the difference: before and after they accounts[0] wins lottery
        const difference = finalBalance - initialBalance;

        //assert defference is more than 1.8 ether
        //Note 1.8 because they is a gas fee for the sent trasaction on the ethereum network
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        //Check the contracts state is reset and is ready for next lottery round.
        assert.strictEqual(0, players.length);

        // get balance of the contracts account
        const balance = await web3.eth.getBalance(lottery.options.address)
    
        //Check if balance equals 0
        assert.strictEqual('0', balance);
    })

});