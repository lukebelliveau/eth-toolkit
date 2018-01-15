const argumentMap = require("../argumentMap");
const getABIAndBytecode = require("../getABIAndBytecode");

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

  module.exports = {
      callPromptAndExecute,
      call,
  }