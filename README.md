# eth-toolkit
CLI tool for Ethereum developers.

WIP

    $ npm install -g eth-toolkit

    $ parity
    
Note that you still need to go into the Parity UI to confirm transaction requests.

## Deploy contract
`$ eth-toolkit deploy <path to *.sol file> <your address>`

Example:

    $ yarn start deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72

## Call contract
`$ eth-toolkit call <method call> <address of contract> <path to *.sol file>`

Example:

    $ eth-toolkit call "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79 Greeter.sol
