const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../../../models/user");
const { default: mongoose } = require("mongoose");

describe("user.generateAuthToken", () => {
  it("Should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
