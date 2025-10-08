import connectDB from "@/lib/mongodb";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    // Verify token and attach user to req.user
    const user = await verifyToken(req, res);
    if (!user) return; // stops execution if invalid token

    // Use the standardized role check
    checkRole(["admin", "system-admin"])(req, res, () => {
      // Return only the needed user info
      res.status(200).json({
        id: req.user._id,
        role: req.user.role,
      });
    });
  } catch (error) {
    console.error("Error in verify-user-role:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
