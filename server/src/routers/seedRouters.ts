import asyncHandler from "express-async-handler";
import express, { Request, Response } from "express";
import { ProductModel } from "../models/productModel";
import { sampleProducts } from "../data";

export const seedRouter = express.Router();

seedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(sampleProducts);
    res.json({ createdProducts });
  })
);
export default seedRouter;
