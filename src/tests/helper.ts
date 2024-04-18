import { testDB } from "libs/db";
import { IUser } from "routes/users/users.model";
import { TEST_PRODUCTS, TEST_USER } from "./constant";
import { IProduct, ProductModel } from "routes/products/products.model";

export type SignUpResponseType = {
  accessToken: string;
  success: true;
};

export async function signupUserHelper(
  user?: Partial<IUser>
): Promise<SignUpResponseType> {
  try {
    return await userTestHelper.signUpUser({ ...TEST_USER, ...user });
  } catch (e) {
    throw e;
  }
}

export async function createProductForTest(
  props?: CreateProductForTestPayload
): Promise<IProduct[]> {
  try {
    let user: string;
    if (props?.userId) {
      user = props.userId;
    } else {
      const is_user = await getUserProfileForTest(props?.customUserCredentials);
      user = is_user?._id;
    }

    let userDefinedProduct;
    if (props?.products) {
      if (Array.isArray(props.products)) {
        userDefinedProduct = props.products.map((item) => ({ ...item, user }));
      } else {
        userDefinedProduct = { ...props.products, user };
      }
    } else {
      userDefinedProduct = TEST_PRODUCTS.map((item) => ({ ...item, user }));
    }
    await ProductModel.create(userDefinedProduct), { ordered: true };
    return await ProductModel.find().populate("user");
  } catch (e) {
    throw e;
  }
}

export async function getUserProfileForTest(
  user?: Partial<IUser>
): Promise<IUser> {
  try {
    const { accessToken } = await signupUserHelper(user);
    return await userTestHelper.getUserWithAccessToken(accessToken);
  } catch (e) {
    throw e;
  }
}

type CreateProductForTestPayload = {
  userId?: string;
  products?: IProduct | IProduct[];
  customUserCredentials?: Partial<IUser>;
};

class UserTestHelper {
  async signUpUser(user: Partial<IUser>): Promise<SignUpResponseType> {
    return new Promise((resolve, reject) => {
      testDB
        .request()
        .post("/users/signup")
        .send(user)
        .set("Content-Type", "application/json")
        .then((res) => {
          const body = res.body;
          resolve(body);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async loginUser({
    username,
    password,
  }: {
    password: string;
    username: string;
  }): Promise<SignUpResponseType> {
    return new Promise((resolve, reject) => {
      testDB
        .request()
        .post("/users/login")
        .send({
          username,
          password,
        })
        .set("Content-Type", "application/json")
        .then((res) => {
          const body = res.body;
          resolve(body);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getUserWithAccessToken(accessToken: string): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      testDB
        .request()
        .get("/users/me")
        .set("authorization", `Bearer ${accessToken}`)
        .then((res) => {
          resolve(res.body);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

export const userTestHelper = new UserTestHelper();
