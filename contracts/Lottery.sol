//Specifies the version of Solidity that our code is written with
pragma solidity ^0.4.17;

//Defines a new contract that will have some number of methods and variables.
contract Lottery {
    
    //address type has methods that can be called on the variable to send money
    address public manager;
    //dynamic array of addresses that is public
    address[] public players;
    
    constructor() public {
        //senders address assigned to manager that invokes the constructor function
        manager = msg.sender;
    }
    
    // payable means that user creating transaction might want to send some ether.
    function enterLottery() public payable {
        
        //require is used for validation. Can pass in boolean expression.
        //If false, the process is exited and no changes are made to the contract.
        //If true, the code continues to execute.
        //ether specifies the ammount and converts into wei.
        require(msg.value > .01 ether);
        
        //add the senders address to the dynamic array[] players
        players.push(msg.sender);
        
    }
    
    function pickWinner() public restricted{
        require(manager == msg.sender);
        
        uint index = randomNumber() % players.length;
        players[index].transfer(this.balance); //returns the address of player | call the transfer() on the hash
        players = new address[](0); // returns contract to intial state of when initially deployed.
    }
    
    // function to generate a pseudo random number by hashing the blocktime, time & the ammount of contestants.
    function randomNumber() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
}