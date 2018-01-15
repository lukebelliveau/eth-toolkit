# eth-toolkit
CLI tool for Ethereum developers.

![Sample screenshot](https://image.ibb.co/icj9U6/Screen_Shot_2018_01_15_at_2_14_58_PM.png)

WIP

This is only intended for use on development chains. I repeat..

**This application offers no protection or security of any kind. Do not use outside of development chains.**

    $ npm install -g eth-toolkit

    $ parity

    $ eth-toolkit

The easiest way to explore `eth-toolkit` is the prompt interface, which `eth-toolkit` runs by default.
If you'd rather enter all arguments in one command, run `eth-toolkit args` and enter values as shown below.
    
Note that you still need to go into the Parity UI to confirm transaction requests.

## Deploy contract
`$ eth-toolkit args deploy <path to *.sol file> <your address> <arguments>`

Example:

    $ eth-toolkit args deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72 "Hello world!"

Note: to have `eth-toolkit` generate an account and deploy from there, enter 'new' as the address.


## Call contract
`$ eth-toolkit args call <path to *.sol file> <method call> <address of contract>`

Example:

    $ eth-toolkit args call Greeter.sol "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79
