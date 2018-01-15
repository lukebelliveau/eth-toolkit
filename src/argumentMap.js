module.exports = {
  cliArgs: process.argv[2] === "args",
  operation: process.argv[3],
  deploy: {
    contractPath: process.argv[4],
    contractPath: process.argv[4],
    contractName: process.argv[5],
    myAccount: process.argv[6],
    myArguments: process.argv[7],
  },
  call: {
    contractPath: process.argv[4],
    contractName: process.argv[5],
    call: process.argv[6],
    contractAddress: process.argv[7],
    options: process.argv[8],
  },
};
