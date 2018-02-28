# eth-toolkit
CLI tool for Ethereum developers. Mostly hacking on this to play with the [web3 client](https://github.com/ethereum/web3.js/). 

![Sample screenshot](https://image.ibb.co/icj9U6/Screen_Shot_2018_01_15_at_2_14_58_PM.png)

WIP

This is only intended for use on development chains. I repeat..

**This application offers no protection or security of any kind. Do not use outside of development chains.**

    $ npm install -g eth-toolkit

    $ parity

    $ eth-toolkit

The easiest way to explore `eth-toolkit` is the prompt interface, which `eth-toolkit` runs by default.
If you'd rather enter all arguments in one command, run `eth-toolkit args` and enter values as shown below.

Here's what I can do:
- [deploy contract](#deploy-contract)
- [call contract method](#call-method)

## deploy contract
### Inputs
- **Path to \*.sol file**: Path to contract you're deploying.
- **Name of contract**: Name of contract, so `contract Greeter {...}` corresponds to "Greeter".
- **Address of sender**: Your address to send the contract from. For now, you'll need to use the Parity UI to sign the contract. If you'd like `eth-toolkit` to generate a new account and publish from there, leave this blank.
- **Arguments for constructor**: This string is inserted into an array and passed as the `arguments`.
value in `contract.deploy()`, so separate your args with commas.

### Args
`$ eth-toolkit args deploy <path to *.sol file> <your address> <arguments>`

Example:

    $ eth-toolkit args deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72 "Hello world!"

Note: to have `eth-toolkit` generate an account and deploy from there, enter 'new' as the address.


## call method
### Inputs
- **Path to \*.sol file**: Path to contract you're deploying.
- **Name of contract**: Name of contract, so `contract Greeter {...}` corresponds to "Greeter".
- **Call to execute**: Method to call. Call with your arguments - like `add(2, 2)`.
- **Address of contract**: Address of callee.


### Args
`$ eth-toolkit args call <path to *.sol file> <method call> <address of contract>`

Example:

    $ eth-toolkit args call Greeter.sol "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79
