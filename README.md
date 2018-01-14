# eth-toolkit
CLI tool for Ethereum developers.

WIP

    $ npm install -g eth-toolkit

    $ parity

    $ eth-toolkit --help
    
Note that you still need to go into the Parity UI to confirm transaction requests.

<<<<<<< HEAD
## Deploy contract
`$ eth-toolkit deploy <path to *.sol file> <your address>`

Example:

    $ yarn start deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72

## Call contract
`$ eth-toolkit call <path to *.sol file> <method call> <address of contract>`

Example:

    $ eth-toolkit call Greeter.sol "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79
