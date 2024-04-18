import express from "express";
import { productService } from "./products.service";
import { token } from "middlewares/token";

export const ProductRouter = express.Router();

ProductRouter.get("/:id", async (req, res, next) => {
  try {
    const result = await productService.getOneProduct(req.params.id);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

ProductRouter.post(
  "/",
  token.getUserIdFromAccessToken,
  async (req: any, res, next) => {
    try {
      const result = await productService.createProduct({
        ...req.body,
        user: req.userId,
      });
      res.send(result);
    } catch (e) {
      next(e);
    }
  }
);

ProductRouter.get("/", async (req, res, next) => {
  try {
    const result = await productService.getProducts();
    res.send(result);
  } catch (e) {
    next(e);
  }
});

ProductRouter.get(
  "/",
  token.getUserIdFromAccessToken,
  async (req: any, res, next) => {
    try {
      const result = await productService.getProductsByUserId(req.userId);
      res.send(result);
    } catch (e) {
      next(e);
    }
  }
);

ProductRouter.put(
  "/:id",
  token.getUserIdFromAccessToken,
  async (req: any, res, next) => {
    try {
      const result = await productService.updateProduct(
        req.params.id,
        req.body,
        req.userId
      );
      res.send(result);
    } catch (e) {
      next(e);
    }
  }
);

ProductRouter.delete(
  "/:id",
  token.getUserIdFromAccessToken,
  async (req: any, res, next) => {
    try {
      const result = await productService.deleteProduct(
        req.params.id,
        req.userId
      );
      res.send(result);
    } catch (e) {
      next(e);
    }
  }
);
