import { testDB } from "libs/db";
import { user_credential } from "tests/constant";
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
        .send(user_credential)
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
          username: "username",
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
  it("Should not create user if username is not provided", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/signup")
        .send({
          first_name: "first_test",
          last_name: "last_test",
          email: "email@email.com",
          password: "123456",
        })
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Username is required");
    } catch (e) {
      throw e;
    }
  });
  it("Should not create user if email already exist", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/signup")
        .send({
          first_name: "first_test",
          last_name: "last_test",
          email: "test1@test.com",
          username: "username",
          password: "123456",
        })
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Email already exist");
    } catch (e) {
      throw e;
    }
  });

  it("Should not create user if username already exist", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/signup")
        .send({
          first_name: "first_test",
          last_name: "last_test",
          email: "test@test2.com",
          username: "test1",
          password: "123456",
        })
        .set("Content-Type", "application/json");
      const body = res.body;
      expect(res.status).toBe(500);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Username already exist");
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
          username: "test1",
          password: "123456",
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
          username: "wrong123@gmail.com",
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
          username: "test@test2.com",
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
  it("should login with username", async () => {
    try {
      const res = await testDB
        .request()
        .post("/users/login")
        .send({
          username: "test1",
          password: "123456",
        })
        .set("Content-Type", "application/json");
      expect(res.status).toBe(200);
    } catch (e) {
      throw e;
    }
  });
});
