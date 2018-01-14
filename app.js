#! /usr/bin/env node
const Web3 = require('web3');
const solc = require("solc");
const fs = require('fs');

const myAccount = process.argv[3];

// Start Parity locally and connect via RPC
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

if(process.argv.length < 3) {
    console.log("Please enter .sol file as first argument.");
    process.exit();
};

const source = fs.readFileSync(process.argv[2]).toString();

const contracts = solc.compile(source).contracts
const compiledContract = contracts[':greeter'];

// grab artifacts
const abi = JSON.parse(compiledContract.metadata).output.abi;
const bytecode = '0x' + compiledContract.bytecode;

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
    console.log("SUCCESS!")
    const deployedAddress = res._address;
    const deployedContract = new web3.eth.Contract(abi, deployedAddress);

    console.log("Contract deployed to address:");
    console.log("- " + deployedAddress)

    console.log("Calling say() on deployed contract...");
    return deployedContract.methods.say().call({from: myAccount})
})
.then(res => {
    console.log("Called say()! Response:")
    console.log("- " + res)

    // expect(res === myMessage)
})
.catch(err => {
    console.log("ERROR!")
    console.log("- " + err)
})