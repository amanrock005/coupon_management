import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    let con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected successfully ${con.connection.host}`);
  } catch (err) {
    console.log("Failed to connect to DB" + err.message);
  }
};

export default connectDB;
