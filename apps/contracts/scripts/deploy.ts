import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DocAuth with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy
  const DocAuthFactory = await ethers.getContractFactory("DocAuth");
  const docAuth = await DocAuthFactory.deploy();
  await docAuth.waitForDeployment();

  const contractAddress = await docAuth.getAddress();
  console.log("✅ DocAuth deployed to:", contractAddress);

  // Save deployment info
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const network = await ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "localhost" : network.name;

  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: networkName,
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  const filePath = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved to: ${filePath}`);

  // Verify on Etherscan (only for non-local networks)
  if (networkName !== "localhost" && networkName !== "hardhat") {
    console.log("\nWaiting for block confirmations before verification...");
    // Wait for a few confirmations
    const deployTx = docAuth.deploymentTransaction();
    if (deployTx) {
      await deployTx.wait(5);
    }

    console.log("Verifying contract on Etherscan...");
    try {
      const { run } = await import("hardhat");
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error: any) {
      if (error.message.includes("already verified")) {
        console.log("Contract is already verified.");
      } else {
        console.error("Verification failed:", error.message);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
