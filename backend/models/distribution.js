import mongoose from "mongoose";

const distributionSchema = new mongoose.Schema({
  lastIndex: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Distribution = mongoose.model("Distribution", distributionSchema);

export default Distribution;
