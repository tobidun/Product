import DBG from "debug";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { useDataBase } from "libs/db";
import { ProductRouter } from "routes/products/products.controller";
import { UserRouter } from "routes/users/users.controller";
export const app = express();
const debug = DBG("product:server");
dotenv.config();

app.use(cors());

process.env.NODE_ENV !== "test" &&
  useDataBase()
    .then(() => {
      debug("Database connect successfully");
    })
    .catch((err: any) => {
      debug(err);
      debug("Error in connecting to database");
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", UserRouter);
app.use("/products", ProductRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err.statusCode || err.status || 500)
    .send({ message: err.message, success: false });
});
