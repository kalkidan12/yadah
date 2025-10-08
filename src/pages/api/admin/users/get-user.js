import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Verify token and get user
    const user = await verifyToken(req, res);
    if (!user) return;

    // Check role
    checkRole(["admin", "system-admin"])(req, res, async () => {
      const { id } = req.query;

      try {
        const fetchedUser = await User.findById(id).select("-password");
        if (!fetchedUser) {
          return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
