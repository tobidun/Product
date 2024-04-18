import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { UserModel } from "routes/users/users.model";

const secretKey = process.env.TOKEN_KEY || "secretishere";
class Token {
  async createAccessToken(userId: string) {
    return jsonwebtoken.sign({ userId }, secretKey, { expiresIn: "1d" });
  }

  async getUserIdFromAccessToken(req: any, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization as string;
      if (token && token.split(" ")[1]) {
        let decodedToken = jsonwebtoken.verify(
          token.split(" ")[1],
          secretKey
        ) as any;
        let { userId } = decodedToken;

        if (userId) {
          const user = await UserModel.findById(userId);
          req.userId = user?._id;
        }
      }
      next();
    } catch (e: any) {
      if (e.name == "TokenExpiredError")
        return next({ status: 401, message: e.message });
      next({ status: 401, message: e.message });
    }
  }
}

export const token = new Token();
