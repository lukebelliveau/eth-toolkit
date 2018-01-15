const inquirer = require("inquirer");

const getABIAndBytecode = require("../getABIAndBytecode");
const app = require("../app");
const argumentMap = require("../argumentMap");

const deployPromptAndExecute = () => {
  var prompt = inquirer.createPromptModule();
  return prompt([
    {
      type: "input",
      name: "contractPath",
      message: "Path to *.sol file for deployment:",
    },
    {
      type: "input",
      name: "contractName",
      message: "Name of contract for deployment:",
    },
    {
      type: "input",
      name: "myAccount",
      message:
        "Address of transaction sender (if left blank, will create new account):",
    },
    {
      type: "input",
      name: "myArguments",
      message: "Arguments for contract constructor (optional):",
    },
  ]).then(res => {
    return deploy(
      res.contractPath,
      res.contractName,
      res.myAccount,
      res.myArguments,
    );
  });
};

const deploy = (
  contractPath = argumentMap.deploy.contractPath,
  contractName = argumentMap.deploy.contractName,
  myAccount = argumentMap.deploy.myAccount,
  myArguments = argumentMap.deploy.myArguments,
) => {
  console.log(`Compiling and deploying ${contractPath}`);

  const { abi, bytecode } = getABIAndBytecode(
    contractPath.toString(),
    contractName,
  );

  if (myAccount === "" || myAccount === "new") {
    console.log("No address specified, creating account...");
    const newAccount = web3.eth.accounts.create();

    console.log(
      "Account created. NEVER use this account for anything valuable.",
    );
    console.log({
      address: newAccount.address,
      privateKey: newAccount.privateKey,
    });
    const deployment = getDeployment(
      newAccount.address,
      abi,
      bytecode,
      myArguments,
    );

    // encode ABI (contract data + constructor parameters)
    const deployABI = deployment.encodeABI();

    // sign transaction
    return newAccount
      .signTransaction(
        {
          data: deployABI,
          gas: 1000000,
        },
        newAccount.privateKey,
      )
      .then(transaction =>
        deployAndReport(
          web3.eth.sendSignedTransaction,
          "contractAddress",
          transaction.rawTransaction,
        ),
      );
  } else {
    console.log("Remember to sign your contract via Parity UI.");
    const deployment = getDeployment(myAccount, abi, bytecode, myArguments);

    return deployAndReport(deployment.send, "_address");
  }
};

const getDeployment = (account, abi, bytecode, constructorArguments) => {
  const contract = new web3.eth.Contract(abi, "", {
    from: account,
    data: bytecode,
  });

  console.log(`Attempting to deploy contract from address ${account}...`);
  let deployment;
  if (constructorArguments) {
    deployment = contract.deploy({
      arguments: [constructorArguments],
    });
  } else {
    deployment = contract.deploy();
  }

  return deployment;
};

const deployAndReport = (send, addressKey, args) => {
  return send(args)
    .then(res => {
      const deployedAddress = res[addressKey];

      console.log("Success! Contract deployed to address:");
      console.log("- " + deployedAddress);
      return deployedAddress;
    })
    .catch(err => {
      console.log("Error deploying contract:");
      console.log("- " + err);
      throw Error(err);
    });
};

module.exports = {
  deployPromptAndExecute,
  deploy,
};
