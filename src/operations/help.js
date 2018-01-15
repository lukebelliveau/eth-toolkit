module.exports = () => {
    console.log(
      `   Deploy contract from *.sol file
          $ eth-toolkit deploy <path to *.sol file> <your address>
  
          Example:
          $ eth-toolkit deploy Greeter.sol 0x00a329c0648769A73afAc7F9381E08FB43dBEA72
          
      Make call to contract
          $ eth-toolkit call <path to *.sol file> <method call> <address of contract>
          
          Example:
          $ eth-toolkit call Greeter.sol "say()" 0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79`,
    );
    return new Promise(res => res());
  };