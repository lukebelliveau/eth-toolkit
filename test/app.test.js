const { call } = require("../src/app");
const { deploy } = require("../src/operations/deploy");
//mute logs
console.log = jest.fn();

describe("app", () => {
  describe("deploy and call", () => {
    it("works without sender address", done => {
      const message = "Hi Jest!";
      return deploy("./test/resources/Greeter.sol", "Greeter", "", message).then(
        deployedAddress => {
          return call(
            "./test/resources/Greeter.sol",
            "Greeter",
            "say()",
            deployedAddress,
          ).then(response => {
            console.log("GOT RESPONSE");
            expect(response).toEqual(message);
            done();
          });
        },
      );
    });
  
    it("works with sender address", done => {
      const message = "Hi Jest!";
      return deploy("./test/resources/Greeter.sol", "Greeter", "0x00a329c0648769A73afAc7F9381E08FB43dBEA72", message).then(
        deployedAddress => {
          return call(
            "./test/resources/Greeter.sol",
            "Greeter",
            "say()",
            deployedAddress,
          ).then(response => {
            console.log("GOT RESPONSE");
            expect(response).toEqual(message);
            done();
          });
        },
      );
    });
  })
});
