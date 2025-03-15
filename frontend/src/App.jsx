import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { axiosInstance } from "./lib/axios";
import { motion } from "framer-motion";

export default function App() {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);

  const claimCoupon = async () => {
    try {
      const response = await axiosInstance.get("/coupons/claim");
      setCoupon(response.data.code);
      setMessage(response.data.message);
      setTimeLeft(response.data.timeLeft || 0);
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error claiming coupon");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-400">
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-10 w-100 h-400 rounded-xl shadow-xl bg-white backdrop-blur-lg flex items-center justify-center ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="text-center p-10 h-200 w-100 space-y-4">
          <motion.h1
            className="text-3xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🎉 Coupon Distribution 🎟️
          </motion.h1>
          {coupon ? (
            <motion.p
              className="text-xl font-bold text-green-600 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Your Coupon: {coupon}
            </motion.p>
          ) : (
            ""
          )}
          {message && <p className="text-md mt-2 text-gray-700">{message}</p>}
          {timeLeft > 0 && (
            <p className="text-sm text-red-500 mt-2">
              Try again in: {timeLeft} seconds
            </p>
          )}
          <motion.div whileTap={{ scale: 0.9 }}>
            <button
              onClick={claimCoupon}
              disabled={timeLeft > 0}
              className="mt-4 mb-4 w-[200px] bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-md py-2"
            >
              Claim Coupon
            </button>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease;
        }
      `}</style>
    </div>
  );
}
