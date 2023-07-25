import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { keyRouter } from "./src/routers/keyRouter";
import { orderRouter } from "./src/routers/orderRouter";
import { productRouter } from "./src/routers/productRouter";
import { seedRouter } from "./src/routers/seedRouter";
import { userRouter } from "./src/routers/userRouter";
import { uploadRouter } from "./src/routers/uploadRouter";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/alirezababamerndb";
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(() => {
    console.log("error mongodb");
  });

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seed", seedRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/keys", keyRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
  next();
});

const PORT: number = parseInt((process.env.PORT || "4000") as string, 10);
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
