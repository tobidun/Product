import { Document, model, Model, Schema, Types } from "mongoose";
import { IUser } from "routes/users/users.model";

export interface IProduct extends Document {
  name: string;
  price: number;
  user: Types.ObjectId | IUser | string;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String },
    price: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    toObject: { getters: true, virtuals: true },
  }
);

export const ProductModel: Model<IProduct> = model<IProduct>(
  "Product",
  ProductSchema
);
