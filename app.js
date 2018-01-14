#! /usr/bin/env node
const Web3 = require('web3');
const solc = require("solc");
const fs = require('fs');

// Start Parity locally and connect via RPC
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const getABIAndBytecode = contractPath => {
    const source = fs.readFileSync(contractPath).toString();

    const contracts = solc.compile(source).contracts
    const compiledContract = contracts[':greeter'];
    
    // grab artifacts
    const abi = JSON.parse(compiledContract.metadata).output.abi;
    const bytecode = '0x' + compiledContract.bytecode;

    return { abi, bytecode };
}

const call = (
    contractPath = process.argv[3],
    call = process.argv[4], 
    contractAddress = process.argv[5], 
    options = process.argv[6]
) => {
    contractABI = getABIAndBytecode(contractPath).abi;

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    console.log(`Calling ${call} on ${contractAddress}...`);
    eval(`contract.methods.${call}.call()`)
    .then(res => {
        console.log(`Response:`)
        console.log(res)
        return res;
    })
    .catch(err => {
        console.log(`Error calling ${call}:`)
        console.log(err)
    })
};

const deploy = () => {
    console.log(`Compiling and deploying ${process.argv[3]}`)
    const myAccount = process.argv[4];

    if(process.argv.length < 3) {
        console.log("Please enter .sol file as first argument.");
        process.exit();
    };
    
    const { abi, bytecode } = getABIAndBytecode(process.argv[3]);
    
    //TODO: sign this contract without Parity UI
    const contract = new web3.eth.Contract(abi, "", {
        from: myAccount,
        data: bytecode
    });
    
    // Initialize with constructor arguments and send to blockchain
    const myMessage = "bonsoir";
    console.log("Attempting to deploy contract...");
    contract.deploy({
        arguments: [myMessage]
    })
    .send()
    .then(res => {
        const deployedAddress = res._address;

        console.log("Success! Contract deployed to address:");
        console.log("- " + deployedAddress)
    })
    .catch(err => {
        console.log("Error deploying contract:")
        console.log("- " + err)
    })
}

switch (process.argv[2]) {
    case "deploy": {
        deploy();
        break;
    };
    case "call": {
        call();
        break;
    }
    default: console.log("Invalid command.");
}