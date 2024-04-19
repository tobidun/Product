import { ProductModel, IProduct } from "routes/products/products.model";
import { unauthorizedUser } from "utils/error-helper";

class ProductService {
  async createProduct(body: IProduct) {
    try {
      const { name, price, user } = body;
      if (!name.trim()) throw new Error("Name is required");
      if (!price) throw new Error("Price is required");
      const product = await ProductModel.create({ name, price, user });
      return product;
    } catch (e) {
      throw e;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find({ isDeleted: false });
      return products;
    } catch (e) {
      throw e;
    }
  }

  async getOneProduct(id: string) {
    try {
      const product = await ProductModel.findOne({ id: id });
      return product;
    } catch (e) {
      throw e;
    }
  }

  async getProductsByUserId(userId: string) {
    try {
      const products = await ProductModel.find({
        $and: [{ user: userId }, { isDeleted: false }],
      });
      return products;
    } catch (e) {
      throw e;
    }
  }

  async updateProduct(id: string, body: IProduct, userId: string) {
    try {
      const is_user = await ProductModel.findOne({ _id: id, user: userId });
      if (!is_user) return unauthorizedUser("Unauthorized request");

      const product = await ProductModel.findOneAndUpdate(
        { _id: id },
        { ...body },
        { new: true }
      );
      return product;
    } catch (e) {
      throw e;
    }
  }

  async deleteProduct(id: string, userId: string) {
    try {
      const isUser = await ProductModel.findOne({ _id: id, user: userId });
      if (!isUser) return unauthorizedUser("Unauthorized request");

      await ProductModel.findOneAndUpdate({ _id: id }, { isDeleted: true });
      return { message: "Product deleted successfully" };
    } catch (e) {
      throw e;
    }
  }
}

export const productService = new ProductService();
