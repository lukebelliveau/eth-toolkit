const Web3 = require("web3");
const solc = require("solc");
const fs = require("fs");

const inquirer = require("inquirer");

const { deployPromptAndExecute, deploy } = require("./operations/deploy");
const argumentMap = require("./argumentMap");

// Start Parity locally and connect via RPC
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
global.web3 = web3;

const getABIAndBytecode = (contractPath, contractName) => {
  const source = fs.readFileSync(contractPath).toString();

  const contracts = solc.compile(source).contracts;
  const compiledContract = contracts[`:${contractName}`];

  // grab artifacts
  const abi = JSON.parse(compiledContract.metadata).output.abi;
  const bytecode = "0x" + compiledContract.bytecode;

  return { abi, bytecode };
};

const call = (
  contractPath = argumentMap.call.contractPath,
  contractName = argumentMap.call.contractName,
  call = argumentMap.call.call,
  contractAddress = argumentMap.call.contractAddress,
  options = argumentMap.call.options,
) => {
  contractABI = getABIAndBytecode(contractPath, contractName).abi;

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  console.log(`Calling ${call} on ${contractAddress}...`);
  // return eval(`contract.methods.${call}.call()`)
  return contract.methods
    .say()
    .call()
    .then(res => {
      console.log(`Response:`);
      console.log(res);
      return res;
    })
    .catch(err => {
      console.log(`Error calling ${call}:`);
      console.log(err);
      throw Error(err);
    });
};

const help = () => {
  console.log(
    `   Deploy contract from *.sol file
        $ eth-toolkit deploy <path to *.sol file> <your address>

        Example:
        $ eth-toolkit deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72
        
    Make call to contract
        $ eth-toolkit call <path to *.sol file> <method call> <address of contract>
        
        Example:
        $ eth-toolkit call Greeter.sol "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79`,
  );
  return new Promise(res => res());
};

const executeOperation = choice => {
  switch (choice) {
    case "deploy": {
      deploy();
      break;
    }
    case "call": {
      call();
      break;
    }
    case "help": {
      help();
      break;
    }
    default:
      console.log("Invalid command.");
  }
};

const callPromptAndExecute = () => {
  var prompt = inquirer.createPromptModule();
  return prompt([
    {
      type: "input",
      name: "contractPath",
      message: "Path to *.sol file for contract call:",
    },
    {
      type: "input",
      name: "contractName",
      message: "Name of contract for deployment:",
    },
    {
      type: "input",
      name: "call",
      message: "Call to execute (ex. add(1, 2)):",
    },
    {
      type: "input",
      name: "contractAddress",
      message: "Address of contract to call:",
    },
    {
      type: "input",
      name: "options",
      message: "Options (optional):",
    },
  ]).then(res => {
    return call(
      res.contractPath,
      res.contractName,
      res.call,
      res.contractAddress,
      res.options,
    );
  });
};

const promptAfter = fxn => {
  fxn().then(() => {
    runPrompt();
  });
};

const runPrompt = () => {
  var prompt = inquirer.createPromptModule();
  prompt({
    type: "list",
    name: "operation",
    message: "What would you like to do?",
    choices: ["deploy", "call", "help", "exit"],
  }).then(response => {
    const operation = response.operation;

    switch (operation) {
      case "deploy": {
        promptAfter(deployPromptAndExecute);
        break;
      }
      case "call": {
        promptAfter(callPromptAndExecute);
        break;
      }
      case "help": {
        promptAfter(help);
        break;
      }
      case "exit": {
        break;
      }
      default: {
        console.error("Issue parsing the selection option.");
        process.exit(1);
      }
    }
  });
};

const run = () => {
  if (argumentMap.cliArgs) {
    executeOperation(argumentMap.operation);
  } else {
    runPrompt();
  }
};

module.exports = {
  call,
  run,
  getABIAndBytecode,
};
