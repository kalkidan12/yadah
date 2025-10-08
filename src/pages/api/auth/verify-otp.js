import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
import rateLimit from "express-rate-limit";

await connectDB();

// Rate limiter: 5 requests per 24 hours per IP
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message:
    "You have reached the limit of 5 OTP verification attempts in 24 hours.",
  keyGenerator: (req) =>
    req.headers["x-real-ip"] || req.connection.remoteAddress,
});

export default async function handler(req, res) {
  limiter(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
      const user = await Auth.findOne({
        email,
        resetOTP: otp,
        resetOTPExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // OTP is valid
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
