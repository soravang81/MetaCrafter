// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public owner;
    uint public ticketPrice;
    uint public maxTickets;
    address[] public players;
    bool public lotteryEnded;

    event TicketPurchased(address indexed player, uint ticketCount);
    event LotteryWinner(address indexed winner, uint prizeAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint _ticketPrice, uint _maxTickets) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        maxTickets = _maxTickets;
        lotteryEnded = false;
    }

    function buyTicket() public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        require(players.length < maxTickets, "All tickets sold");
        require(!lotteryEnded, "Lottery has ended");

        players.push(msg.sender);
        emit TicketPurchased(msg.sender, players.length);

        if (players.length == maxTickets) {
            pickWinner();
        }
    }

    function pickWinner() internal {
        require(players.length == maxTickets, "Not enough tickets sold");

        uint winnerIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % players.length;
        address winner = players[winnerIndex];
        uint prizeAmount = address(this).balance;

        payable(winner).transfer(prizeAmount);
        emit LotteryWinner(winner, prizeAmount);

        lotteryEnded = true;
    }

    function resetLottery() public onlyOwner {
        require(lotteryEnded, "Lottery is still ongoing");

        assert(lotteryEnded == true);

        delete players;
        lotteryEnded = false;
    }

    function forceEndLottery() public onlyOwner {
        if (lotteryEnded) {
            revert("Lottery has already ended");
        }

        lotteryEnded = true;

        for (uint i = 0; i < players.length; i++) {
            payable(players[i]).transfer(ticketPrice);
        }

        delete players ;
    }
}
