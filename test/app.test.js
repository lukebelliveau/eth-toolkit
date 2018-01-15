const { deploy, call } = require("../src/app");
//mute logs
console.log = jest.fn()

describe("app", () => {
  it("works", done => {
    const message = "Hi Jest!"
    return deploy("./test/resources/Greeter.sol", "Greeter", "", message)
    .then(deployedAddress => {
      return call("./test/resources/Greeter.sol", "Greeter", "say()", deployedAddress)
      .then(response => {
        console.log("GOT RESPONSE")
        expect(response).toEqual(message)
        done();
      })
    })

  });
});
