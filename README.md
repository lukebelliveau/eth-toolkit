# eth-toolkit
CLI tool for Ethereum development.

WIP, can currently compile and deploy a contract.

    $ npm install -g eth-toolkit

    $ parity

## Deploy contract from *.sol file
`$ eth-toolkit deploy <path to *.sol file> <your address>`

Example:

    $ yarn start deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72

## Make call to contract
`$ eth-toolkit call <method call> <address of contract> <path to *.sol file>`

Example:

    $ eth-toolkit call "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79 Greeter.sol