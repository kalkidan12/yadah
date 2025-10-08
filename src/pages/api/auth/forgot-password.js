import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import rateLimit from "express-rate-limit";
import Auth from "@/models/Auth";
import { sendResetOTPEmail } from "@/lib/auth/email";

await connectDB();

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24h
  max: 5,
  message: "You have reached the limit of 5 requests in 24 hours.",
  keyGenerator: (req) =>
    req.headers["x-real-ip"] || req.connection.remoteAddress,
});

export default async function handler(req, res) {
  limiter(req, res, async () => {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method not allowed" });

    const { email } = req.body;

    try {
      const user = await Auth.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Generate 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetOTP = otp;
      user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
      await user.save();

      await sendResetOTPEmail(email, otp);

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
