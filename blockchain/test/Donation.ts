import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { DonationContract, DonationContract__factory } from "../typechain-types";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";


describe("DonationContract",  function () {

  type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

  type Signer = PromiseType<ReturnType<typeof ethers.getSigner>>;

  let donationContract : DonationContract, owner: Signer, donor1 : Signer, donor2: Signer, benefitiary: Signer;

  beforeEach(async function () {
    ({donationContract, owner, donor1, donor2, benefitiary} = await loadFixture(deployDonationFixture));

  });
  async function deployDonationFixture() {
    // Contracts are deployed using the first donor/account by default
    const [owner, donor1, donor2, benefitiary] = await ethers.getSigners();

    const Donation = await ethers.getContractFactory("DonationContract");
    const donationContract : DonationContract = await Donation.deploy(benefitiary.address);

    // Add Candidate1



    return {donationContract,  owner, donor1, donor2, benefitiary };
  }

   describe("donate", function () {

    it("should allow a user to donate to the contract", async function () {
      await donationContract.connect(donor1).donate("Thank you for your donation!", { value: ethers.parseEther("1") });

      const donationCount = await donationContract.donationCounter();
      expect(donationCount).to.equal(1);
    });
    
    it("should not allow donations when emergency stopped", async function () {
      await donationContract.connect(owner).setEmergencyStop(true);
      await expect(donationContract.connect(donor1).donate("For life", { value: ethers.parseEther("1") })).to.be.revertedWith("Contract operations are currently paused");
    });
    
    it("should run donate function when funds are sent to contract", async function () {
      const donationCountBefore = await donationContract.donationCounter();
      const tx = await donor1.sendTransaction({
        to: donationContract.target,
        value: ethers.parseEther("1"),
      });
      const donationCount = await donationContract.donationCounter();
      expect(donationCount).to.equal(donationCountBefore + BigInt(1));
    });

    it("should emit a DonationReceived event when a user donates to the contract", async function () {

        const donateTransaction = donationContract.connect(donor1).donate('message', { value: 50 });
        const timestamp = (await (await donateTransaction).provider.getBlock('latest'))?.timestamp;
        // Transfer 50 tokens from owner to addr1
        await expect(donateTransaction)
          .to.emit(donationContract, "DonationReceived")
          .withArgs(1, donor1.address, 50, 'message', timestamp );
  
        // Transfer 50 tokens from addr1 to addr2
        // We use .connect(signer) to send a transaction from another account
        // await expect(donationContract.connect(donor1).donate(benefitiary.address, {value: 50}))
        //   .to.emit(donationContract, "Transfer")
        //   .withArgs(donor1.address, donor2.address, 50, timeStamp);
     
    });

    it("should increase the donation count when a user donates to the contract", async function () {
      await donationContract.connect(donor1).donate("Thank you for your donation!", { value: ethers.parseEther("1") });
      await donationContract.connect(donor2).donate("Thank you for your donation!", { value: ethers.parseEther("2") });

      const donationCount = await donationContract.donationCounter();
      expect(donationCount).to.equal(2);
    });
  });

  describe("setBeneficiary", function () {
    it("should allow the owner to set the beneficiary", async function () {
      await donationContract.connect(owner).setBeneficiary(donor1.address);

      const beneficiary = await donationContract.beneficiary();
      expect(beneficiary).to.equal(donor1.address);
    });

    it("should not allow a non-owner to set the beneficiary", async function () {
      await expect(donationContract.connect(donor1).setBeneficiary(donor1.address)).to.be.revertedWith("Only the contract owner can call this function");
    });
  });
  describe("setEmergencyStop", function () {
    it("should allow the owner to set the emergency stop", async function () {
      await donationContract.connect(owner).setEmergencyStop(true);

      const emergencyStop = await donationContract.emergencyStop();
      expect(emergencyStop).to.equal(true);
    });

    it("should not allow a non-owner to set the emergency stop", async function () {
      await expect(donationContract.connect(donor1).setEmergencyStop(true)).to.be.revertedWith("Only the contract owner can call this function");
    });

  });
  describe("withdraw", function () {
    
    it("should not allow a non-beneficiary to withdraw the funds", async function () {
      await expect(donationContract.connect(donor1).withdrawFunds()).to.be.revertedWith("Only the beneficiary can withdraw funds");
    })
    it("should not withdrawal when emergency stopped", async function () {
      await donationContract.connect(donor1).donate("Thank you for your donation!", { value: ethers.parseEther("1") });
      await donationContract.connect(owner).setEmergencyStop(true);
      await expect(donationContract.connect(benefitiary).withdrawFunds()).to.be.revertedWith("Contract operations are currently paused");    })
    
      it("should allow the beneficiary to withdraw the funds", async function () {
        await donationContract.connect(donor1).donate("Thank you for your donation!", { value: ethers.parseEther("1") });
        await donationContract.connect(donor2).donate("Thank you for your donation!", { value: ethers.parseEther("2") });
  
        const BenefitiaryBalanceBefore = await ethers.provider.getBalance(benefitiary.address);
        const ContractBalanceBefore = await ethers.provider.getBalance(await donationContract.getAddress());
        
        const withdrawal = await donationContract.connect(benefitiary).withdrawFunds();
        
        const ContractBalanceAfter = await ethers.provider.getBalance(await donationContract.getAddress());
  
        const receipt = await ethers.provider.getTransactionReceipt(withdrawal.hash)
  
        const gasUsed = receipt?.gasUsed
  
        console.log("receipt", receipt)
  
        const BenefitiaryBalanceAfter = await ethers.provider.getBalance(benefitiary.address);
  
        expect(BenefitiaryBalanceAfter).to.equal(BenefitiaryBalanceBefore + BigInt(ethers.parseEther("3")) -BigInt((gasUsed ?? 0)));
        // expect(donationContract).to.equal(BenefitiaryBalanceBefore + BigInt(ethers.parseEther("3")) - (gasUsed ?? BigInt(0)));
      }
  
  )

}

);
  
});