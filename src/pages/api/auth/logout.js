import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
import cookie from "cookie";
import rateLimit from "express-rate-limit";

await connectDB();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "You can only perform logout 10 times per hour.",
  keyGenerator: (req) =>
    req.headers["x-real-ip"] || req.connection.remoteAddress,
});

export default async function handler(req, res) {
  limiter(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed." });
    }

    const { userId } = req.body;

    try {
      if (userId) {
        const user = await Auth.findById(userId);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      }

      // Clear the refresh token cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
          path: "/",
        })
      );

      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  });
}
