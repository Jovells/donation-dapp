// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DonationContract {
    address public owner;
    address public beneficiary;
    bool public emergencyStop;
    address[] public donors;
    uint256 public totalDonations;
    uint256 public donationCounter;

    struct Donation {
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    mapping(address => mapping(uint256 => Donation)) public donations;


    event DonationReceived(uint256 indexed donationId, address indexed donor, uint256 amount, string message, uint256 timestamp);
    event BeneficiaryChanged(address indexed newBeneficiary);
    event EmergencyStopSet(bool indexed emergencyStop);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier notEmergencyStopped() {
        require(!emergencyStop, "Contract operations are currently paused");
        _;
    }

    constructor(address _initialBeneficiary) {
        owner = msg.sender;
        beneficiary = _initialBeneficiary;
        emergencyStop = false;
    }

    function donate(string memory _message) public payable notEmergencyStopped {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        uint256 currentDonationId = ++donationCounter;
        donations[msg.sender][currentDonationId] = Donation({
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp
        });

        totalDonations += msg.value;
        donors.push(msg.sender);

        emit DonationReceived(currentDonationId, msg.sender, msg.value, _message, block.timestamp);
    }

    function viewTotalDonations() external view returns (uint256) {
        return totalDonations;
    }

    // function viewDonorList() external view returns (address[] memory) {
    //     address[] memory donorList = new address[](donationCounter);
    //     uint256 index = 0;
    //     for (uint256 i = 0; i < donationCounter; i++) {
    //         if (donors[donations[i].donor]) {
    //             donorList[index++] = donations[i].donor;
    //         }
    //     }
    //     return donorList;
    // }

    function setBeneficiary(address _newBeneficiary) external onlyOwner {
        beneficiary = _newBeneficiary;
        emit BeneficiaryChanged(_newBeneficiary);
    }

    function setEmergencyStop(bool _emergencyStop) external onlyOwner {
        emergencyStop = _emergencyStop;
        emit EmergencyStopSet(_emergencyStop);
    }

    function withdrawFunds() external notEmergencyStopped {
        require(beneficiary != address(0), "Beneficiary address not set");
        require(beneficiary == msg.sender, "Only the beneficiary can withdraw funds");
        require(totalDonations > 0, "No funds to withdraw");

        totalDonations = 0;
        payable(beneficiary).transfer(address(this).balance);
    }

    receive() external payable {
        donate("");
    }
}
