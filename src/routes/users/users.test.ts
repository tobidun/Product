import { testDB } from "libs/db";
import { TEST_USER } from "tests/constant";
import { signupUserHelper } from "tests/helper";

describe("User SignUp", () => {
  beforeAll(async () => {
    await testDB.connect();
  });
  afterAll(async () => {
    await testDB.disconnect();
  });

  it("Should create a user if all fields are provided", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/signup")
        .send(TEST_USER)
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(200);
      expect(body).toHaveProperty("accessToken");
      expect(body.success).toBe(true);
    } catch (e) {
      throw e;
    }
  });

  it("Should not create user if email is not provided", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/signup")
        .send({
          first_name: "first_test",
          last_name: "last_test",
          password: "123456",
        })
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Email is required");
    } catch (e) {
      throw e;
    }
  });
  it("Should not create user if email already exist", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/signup")
        .send(TEST_USER)
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Email already exist");
    } catch (e) {
      throw e;
    }
  });
});

describe("User login", () => {
  beforeAll(async () => {
    await testDB.connect();
    await signupUserHelper();
  });

  afterAll(async () => {
    await testDB.disconnect();
  });

  it("should login if email and password are provided", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/login")
        .send({
          email: TEST_USER.email,
          password: TEST_USER.password,
        })
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(200);
      expect(body).toHaveProperty("accessToken");
      expect(body.success).toBe(true);
    } catch (e) {
      throw e;
    }
  });
  it("if email is not correct", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/login")
        .send({
          email: "wrong123@gmail.com",
          password: "adafadff",
        })
        .set("Content-Type", "application/json");

      const body = res.body;
      expect(res.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Invalid login credentials");
    } catch (e) {
      throw e;
    }
  });
  it("if password does not match", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/login")
        .send({
          email: "test@test2.com",
          password: "wrongpassword",
        })
        .set("Content-Type", "application/json");
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid login credentials");
    } catch (e) {
      throw e;
    }
  });
});
