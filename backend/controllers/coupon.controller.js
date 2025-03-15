import Coupon from "../models/coupon.js";
import IPLog from "../models/ipLog.js";
import Distribution from "../models/distribution.js";

const COOLDOWN = 60 * 60 * 1000;

export const claimCoupon = async (req, res) => {
  const ip = req.ip;
  try {
    // Check if the IP has recently claimed a coupon
    const existingLog = await IPLog.findOne({ ip });
    if (
      existingLog &&
      Date.now() - new Date(existingLog.lastClaimed).getTime() < COOLDOWN
    ) {
      return res
        .status(429)
        .json({ message: "Please wait before claiming another coupon" });
    }

    // Get the current distribution index
    let dist = await Distribution.findOne({});
    if (!dist) {
      dist = new Distribution({ lastIndex: 0 });
      await dist.save();
    }

    // Get the list of coupons
    const coupons = await Coupon.find({});
    if (coupons.length === 0) {
      return res.status(404).json({ message: "No coupons available" });
    }

    // Round-robin index calculation
    const index = (dist.lastIndex + 1) % coupons.length;
    const coupon = coupons[index];

    // Mark the coupon as assigned
    coupon.assigned = true;
    await coupon.save();

    // Update the distribution index
    dist.lastIndex = index;
    await dist.save();

    // Log the IP claim
    await IPLog.findOneAndUpdate(
      { ip },
      { lastClaimed: new Date() },
      { upsert: true }
    );

    // Send response
    res.cookie("claimed", "true", { maxAge: COOLDOWN, httpOnly: true });
    res.status(200).json({ message: "Coupon claimed!", code: coupon.code });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
