const Web3 = require("web3");
const solc = require("solc");
const fs = require("fs");

const inquirer = require("inquirer");

const { deployPromptAndExecute, deploy } = require("./operations/deploy");
const { callPromptAndExecute } = require("./operations/call");
const help = require("./operations/help");
const argumentMap = require("./argumentMap");

// Start Parity locally and connect via RPC
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
global.web3 = web3;

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
  run,
};
