import connectDB from "@/lib/mongodb";
import { serialize } from "cookie";
import Auth from "@/models/Auth";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import rateLimit from "express-rate-limit";

// Rate limiter: 5 requests per 24 hours per IP
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  message: "You have reached the limit of 5 signup attempts in 24 hours.",
  keyGenerator: (req) =>
    req.headers["x-real-ip"] || req.connection.remoteAddress,
});

export default async function handler(req, res) {
  limiter(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      await connectDB();

      // Check if user already exists
      const userExists = await Auth.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const newUser = new Auth({
        firstName,
        lastName,
        email,
        password,
      });
      await newUser.save();

      // Generate tokens
      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

      // Store refresh token in DB
      newUser.refreshToken = refreshToken;
      await newUser.save();

      // Set refresh token cookie
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

      // Respond with user + access token
      res.status(201).json({
        message: "Signup successful.",
        accessToken,
        user: {
          id: newUser._id.toString(),
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
