import { createProductForTest, signupUserHelper } from "tests/helper";
import { IProduct } from "./products.model";
import { testDB } from "libs/db";
import { TEST_PRODUCT } from "tests/constant";

describe("Find by Id", () => {
  let products: IProduct[];
  beforeAll(async () => {
    await testDB.connect();
    products = await createProductForTest();
    console.log(products);
  });
  afterAll(async () => {
    await testDB.disconnect();
  });
  it("find product by id", async () => {
    try {
      const product = products[2];
      console.log(product);
      const res = await testDB
        .request()
        .get(`/products/${product._id}`)
        .set("Content-Type", "application/json");
      expect(res.status).toBe(200);
    } catch (e) {
      throw e;
    }
  });
});

describe("Find Product", () => {
  beforeAll(async () => {
    await testDB.connect();
    createProductForTest();
  });

  afterAll(async () => {
    await testDB.disconnect();
  });

  it("Find all products", async () => {
    const res = await testDB
      .request()
      .get("/products")
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);
  });
});

describe("Create a new Product", () => {
  let accessToken: string;
  beforeAll(async () => {
    await testDB.connect();
    const userLoggedInRes = signupUserHelper();
    accessToken = (await userLoggedInRes).accessToken;
  });
  afterAll(async () => {
    await testDB.disconnect();
  });
  it("should create a new product successfully", async () => {
    const res = await testDB
      .request()
      .post("/products")
      .send({
        name: TEST_PRODUCT.name,
        price: TEST_PRODUCT.price,
      })
      .set("authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });
});

describe("Delete Product", () => {
  let accessToken: string;
  let products: IProduct[];
  beforeAll(async () => {
    await testDB.connect();
    const pd = createProductForTest();
    products = await pd;
    console.log(pd);
    const userLoggedInRes = signupUserHelper();
    accessToken = (await userLoggedInRes).accessToken;
  });
  afterAll(async () => {
    await testDB.disconnect();
  });
  it("should delete product", async () => {
    try {
      const product = products[2];
      const res = await testDB
        .request()
        .delete(`/products/${product._id}`)
        .set("authorization", `Bearer ${accessToken}`);
      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.result.message).toBe("Product deleted successfully");

      const getProductById = await testDB
        .request()
        .get(`/products/${product._id}`);
      expect(getProductById.body.result.is_deleted).toBe(true);

      const getAllProducts = await testDB.request().get("/products");
      expect(getAllProducts.body.result).toBe(undefined);
    } catch (e) {
      throw e;
    }
  });

  it("should not delete if not owner of the product", async () => {
    try {
      const product = products[1];
      const newUserRes = await signupUserHelper({
        email: "anotheruser@test.com",
        password: "password",
        username: "another",
      });
      const res = await testDB
        .request()
        .delete(`/products/delete/${product._id}`)
        .send({ is_deleted: true })
        .set("authorization", `Bearer ${newUserRes.accessToken}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Unauthorized request");
    } catch (e) {
      throw e;
    }
  });
});
