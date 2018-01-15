module.exports = {
    cliArgs: process.argv[2] === "args",
    operation: process.argv[3],
    deploy: {
        contractFilePath: process.argv[4],
        myAccount: process.argv[5],
        myArguments: process.argv[6],
    },
    call: {
        contractPath: process.argv[4],
        call: process.argv[5], 
        contractAddress: process.argv[6], 
        options: process.argv[7],
    }
}