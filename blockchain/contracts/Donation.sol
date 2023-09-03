// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DonationContract {
    address public owner;
    address public currentBeneficiary;
    bool public emergencyStop;
    // address[] public donors;
    uint256 public donationCounter;
    uint256 public deploymentblockNumber;
    mapping(address => uint) public beneficiaries;

    // struct Donation {
    //     uint256 amount;
    //     string message;
    //     uint256 timestamp;
    // }

    // struct Beneficiary {
    //     uint256 amountReceived;
    //     // mapping(address => mapping(uint256 => Donation)) donations;

    // }

    // mapping(address => mapping(uint256 => Donation)) public donations;


    event DonationReceived(uint256 indexed donationId, address indexed donor, address indexed beneficiary, uint256 amount, string message, uint256 timestamp);
    event BeneficiaryChanged(address indexed newBeneficiary);
    event EmergencyStopSet(bool indexed emergencyStop);
    event FundsWithdrawn(address indexed beneficiary, uint256 amount, uint256 timestamp);

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
        currentBeneficiary = _initialBeneficiary;
        emergencyStop = false;
        deploymentblockNumber = block.number;
    }

    function getAmountReceived(address _beneficiary) external view returns (uint256) {
      return beneficiaries[_beneficiary];
    }

    function donate(string memory _message) public payable notEmergencyStopped {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        
        // beneficiaries[currentBeneficiary].donations[msg.sender][currentDonationId] = Donation({
        //     amount: msg.value,
        //     message: _message,
        //     timestamp: block.timestamp
        // });
        beneficiaries[currentBeneficiary] += msg.value;

        // donors.push(msg.sender);

        emit DonationReceived(++donationCounter, msg.sender, currentBeneficiary, msg.value, _message, block.timestamp);
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
        currentBeneficiary = _newBeneficiary;
        emit BeneficiaryChanged(_newBeneficiary);
    }

    function setEmergencyStop(bool _emergencyStop) external onlyOwner {
        emergencyStop = _emergencyStop;
        emit EmergencyStopSet(_emergencyStop);
    }

    function withdrawFunds() external notEmergencyStopped {
        // require(currentBeneficiary != address(0), "Beneficiary address not set");
        // require(currentBeneficiary == msg.sender, "Only the beneficiary can withdraw funds");
        require(beneficiaries[msg.sender] > 0, "No funds to withdraw or not a beneficiary");


        payable(msg.sender).transfer(beneficiaries[msg.sender]);
        beneficiaries[msg.sender] = 0;

        emit FundsWithdrawn(msg.sender, beneficiaries[msg.sender], block.timestamp);
    }

    receive() external payable {
        donate("");
    }
}
