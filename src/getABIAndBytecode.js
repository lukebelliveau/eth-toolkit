const fs = require("fs");
const solc = require("solc");

module.exports = (contractPath, contractName) => {
    const source = fs.readFileSync(contractPath).toString();
  
    const contracts = solc.compile(source).contracts;
    const compiledContract = contracts[`:${contractName}`];
  
    // grab artifacts
    const abi = JSON.parse(compiledContract.metadata).output.abi;
    const bytecode = "0x" + compiledContract.bytecode;
  
    return { abi, bytecode };
  };