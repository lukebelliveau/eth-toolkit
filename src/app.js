#! /usr/bin/env node
const Web3 = require("web3");
const solc = require("solc");
const fs = require("fs");

const inquirer = require("inquirer")

const argumentMap = require("./argumentMap");

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
    contractPath = argumentMap.call.contractPath,
    call = argumentMap.call.call,
    contractAddress = argumentMap.call.contractAddress,
    options = argumentMap.call.options,
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

const deploy = (
    contractFilePath = argumentMap.deploy.contractFilePath, 
    myAccount = argumentMap.deploy.myAccount, 
    myArguments = argumentMap.deploy.myArguments
) => {
    console.log(`Compiling and deploying ${contractFilePath}`)

    const { abi, bytecode } = getABIAndBytecode(contractFilePath.toString());
    
    //TODO: sign this contract without Parity UI
    const contract = new web3.eth.Contract(abi, "", {
        from: myAccount,
        data: bytecode
    });
    
    // Initialize with constructor arguments and send to blockchain
    console.log("Attempting to deploy contract, approve in Parity UI...");
    contract.deploy({
        arguments: [myArguments]
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

const help = () => {
console.log(
`   Deploy contract from *.sol file
        $ eth-toolkit deploy <path to *.sol file> <your address>

        Example:
        $ eth-toolkit deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72
        
    Make call to contract
        $ eth-toolkit call <path to *.sol file> <method call> <address of contract>
        
        Example:
        $ eth-toolkit call Greeter.sol "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79`
)
}

const executeOperation = (choice) => {
    switch (choice) {
        case "deploy": {
            deploy();
            break;
        };
        case "call": {
            call();
            break;
        }
        case "help": {
            help()
            break;
        }
        default: console.log("Invalid command.");
    }
}

const deployPromptAndExecute = () => {
    var prompt = inquirer.createPromptModule();
    prompt([{
        type: "input",
        name: "contractFilePath",
        message: "Path of *.sol file to deploy:",
    },
    {
        type: "input",
        name: "myAccount",
        message: "Address of transaction sender:"
    },
    {
        type: "input",
        name: "myArguments",
        message: "Arguments for contract constructor (optional):"
    }])
    .then(res => {
        deploy(res.contractFilePath, res.myAccount, res.myArguments)
    })
}

if(argumentMap.cliArgs) {
    executeOperation(argumentMap.operation)
} else {
    var prompt = inquirer.createPromptModule();
    prompt({
        type: "list",
        name: "operation",
        message: "What would you like to do?",
        choices: ["deploy", "call", "help"]
    })
    .then((response) => {
        const operation = response.operation

        switch(operation) {
            case "deploy": {
                deployPromptAndExecute();
            }
        }
    })
}