import mongoose from "mongoose";
import dotenv from "dotenv";
import Coupon from "./models/coupon.js";

dotenv.config();

const coupons = [
  { code: "DISCOUNT10", assigned: false },
  { code: "WELCOME20", assigned: false },
  { code: "FREESHIP", assigned: false },
  { code: "SUMMER50", assigned: false },
  { code: "SPRING30", assigned: false },
];

const seedCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Coupon.deleteMany({});
    await Coupon.insertMany(coupons);
    console.log("Coupons added successfully!");
    process.exit();
  } catch (error) {
    console.error("Error adding coupons:", error);
    process.exit(1);
  }
};

seedCoupons();
