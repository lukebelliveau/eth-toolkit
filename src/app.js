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
    return eval(`contract.methods.${call}.call()`)
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
    contractPath = argumentMap.deploy.contractPath, 
    myAccount = argumentMap.deploy.myAccount, 
    myArguments = argumentMap.deploy.myArguments
) => {
    console.log(`Compiling and deploying ${contractPath}`)

    const { abi, bytecode } = getABIAndBytecode(contractPath.toString());
    
    //TODO: sign this contract without Parity UI
    const contract = new web3.eth.Contract(abi, "", {
        from: myAccount,
        data: bytecode
    });
    
    // Initialize with constructor arguments and send to blockchain
    console.log("Attempting to deploy contract, approve in Parity UI...");
    return contract.deploy({
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
return new Promise(res => res());
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
    return prompt([{
        type: "input",
        name: "contractPath",
        message: "Path to *.sol file for deployment:",
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
        return deploy(res.contractPath, res.myAccount, res.myArguments)
    })
}

const callPromptAndExecute = () => {
    var prompt = inquirer.createPromptModule();
    return prompt([{
        type: "input",
        name: "contractPath",
        message: "Path to *.sol file for contract call:",
    },
    {
        type: "input",
        name: "call",
        message: "Call to execute (ex. add(1, 2)):"
    },
    {
        type: "input",
        name: "contractAddress",
        message: "Address of contract to call:"
    },
    {
        type: "input",
        name: "options",
        message: "Options (optional):"
    }])
    .then(res => {
        return call(res.contractPath, res.call, res.contractAddress, res.options)
    })
}

const promptAfter = (fxn) => {
    fxn()
    .then(() => {
        runPrompt();
    })
}

const runPrompt = () => {
    var prompt = inquirer.createPromptModule();
    prompt({
        type: "list",
        name: "operation",
        message: "What would you like to do?",
        choices: ["deploy", "call", "help", "exit"]
    })
    .then((response) => {
        const operation = response.operation

        switch(operation) {
            case "deploy": {
                promptAfter(deployPromptAndExecute);
                break;
            };
            case "call": {
                promptAfter(callPromptAndExecute);
                break;
            };
            case "help": {
                promptAfter(help);
                break;
            }
            case "exit": {
                break;
            };
            default: {
                console.error("Issue parsing the selection option.");
                process.exit(1);
            };
        }
    })
}

if(argumentMap.cliArgs) {
    executeOperation(argumentMap.operation)
} else {
    runPrompt();
}