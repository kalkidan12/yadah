import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import { serialize } from "cookie";
import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
import rateLimit from "express-rate-limit";

await connectDB();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Max 10 login attempts per hour.",
  keyGenerator: (req) =>
    req.headers["x-real-ip"] || req.connection.remoteAddress,
});

export default async function handler(req, res) {
  limiter(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    try {
      const user = await Auth.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found." });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials." });

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      // Set refresh token as HttpOnly cookie
      res.setHeader(
        "Set-Cookie",
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: "/",
        })
      );

      res.status(200).json({
        accessToken,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  });
}
