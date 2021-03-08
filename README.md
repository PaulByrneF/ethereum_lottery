# Lottery Project

This project was created with solidity to develop the lottery smart contract. The application wrapper that interacts with the smart contract was developed using javascript. 

# High Level Concept

Contract

- Contract called lottery
- Contract will have a prize pool
- Contract will have players
- The system will have two types of actors
- Contestants & Manager
- Contestents will send money to the contract, pooling their money as the winning prize.
- Participating contestants' addresses will be stored within the contract in order to choose a winner and therefore, send the winnings to the contestants' respective address.
- The manager will interact with the contract to initiate lottery/raffle.

# Smart Contract Requirements

-  Variables

Name | Purpose
manager | Address of the person who created the contract
players | Array of address of end users who have entered. I.e. sent money to the contract

- Functions

Name | Purpose
enter | Enters an end user into the lottery
pickWinner | Randomly picks a winner and sends them the prize pool.

# Steps Taken

1. Use remix to create intial draft of contract and test on the javascript virtual machine.

# Additional Notes

Basic Types
--------------------------------------------------------------
Name| Notes| Examples
string | Sequence of chars | "Hi There!" "Chocolate"
bool | Boolean value | true, false
int | Integer, positive or negative. Has no decimel | 0 -10 59
uint | 'Unsigned' integer, positive number, no decimel | 0 1 5999
fixed/ufixed | 'Fixed' point number. Number with a decimel after it | 20.001 -40.323 4321
address | Has methods tied to it for sending money | 0x12cdf6ds6ad5dfa5dsf5cd6s6saf55d


Reference Types
--------------------------------------------------------------
Name | Notes | Examples
fixed array | Array that contains a single type of element. Has an unchanging length | int[3] -> [1,2,3] bool[2] -> [true, false]
dynamic array | Array that contains a single type of element. Can change in size over time | int[] -> [1,2,3] bool[] -> [true, false]
mapping | Collection of key value pairs. Think of Javascript objects, Ruby hashes, or Python dictionary. All keys must be of the same type, and all values must be of the same type | mapping (string => string) mapping(int => bool)
struct | Collection of key value pairs that can have different type | struct Car ( string make; string model; uint value;)

Message Object
----------------------------------------------------------------

- Global variable
- msg.data | 'Data' field from the call or transaction that invoked the current fucntion
- msg.gas | Amount of gas the current function invocation has available
- msg.sender | Address of the account that started the current function invocation
- msg.value | Amount of ether (in wei) that was sent along with the function invocation

Msg object = (Account & Call)
- Gloabl variable available for each sent transaction or call

|Account -> Transaction| -> Rinkeby{Contract Instance}

# solidity: Common function types

- Can only used one per function
public | Anyone can call this function
private | Only this contract can call this function

- They mean the same thing
view | This function returns and does not modify the contract's data
constant | This function returns and does not modify the contract's data 

pure | Function will not modify or even read the contract's data
payable | When someone call this function they might send ether along

# Solidity: Modifiers

- Use modifiers to solve repetitive code within contracts

# Solidity: Validation

- require is used for validation. Can pass in boolean expression.
    - If false, the process is exited and no changes are made to the contract.
    - If true, the code continues to execute.


# Installation commands

- npm init | initialises a npm project with package-json
- npm install --save solc@0.4.25 | installs the solidity compiler library
- npm install --save mocha | installs the mocha js testing library
- npm install --save ganache-cli | installs the ethereum local testnet library
- npm install --save web3@1.0.0-beta.26 | installs the js network interaction library
- npm install --save truffe-hdwallet-provider@0.0.3 | installs library for interacting with hardwallets accounts. I.e. MetaMask