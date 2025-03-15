import mongoose from "mongoose";

const ipLogSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  lastClaimed: {
    type: Date,
    default: Date.now,
  },
});

const IPLog = mongoose.model("IPLog", ipLogSchema);

export default IPLog;
