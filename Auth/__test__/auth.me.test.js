const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const app = require("../src/app");
const connectToDb = require("../src/db/db");
const userModel = require("../src/models/user.model");

describe("GET /auth/me", () => {
  let dbConnection;

  beforeAll(async () => {
    dbConnection = await connectToDb();
  });

  afterAll(async () => {
    // Clear DB and close Mongoose connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  it("returns 401 when no auth cookie is provided", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 401 for invalid token in cookie", async () => {
    const fakeToken = jwt.sign({ id: "000000000000000000000000" }, "wrong_secret");
    const res = await request(app)
      .get("/auth/me")
      .set("Cookie", [`token=${fakeToken}`]);
    expect(res.status).toBe(401);
  });

  it("returns 200 and current user when valid token cookie is present", async () => {
    // seed user
    const password = "Secret123!";
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username: "me_user",
      email: "me@example.com",
      password: hash,
      fullName: { firstName: "Me", lastName: "User" },
    });

    // login to obtain cookie
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: "me_user", email: "me@example.com", password });

    expect(loginRes.status).toBe(200);
    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // call /me with cookie
    const res = await request(app)
      .get("/auth/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user._id).toBe(user._id.toString());
    expect(res.body.user.email).toBe("me@example.com");
    expect(res.body.user.username).toBe("me_user");
  });
});
