import mongoose from "mongoose";
mongoose.set("strictQuery", true);

export async function connectDB(url) {
  return await mongoose.connect(url);
}
