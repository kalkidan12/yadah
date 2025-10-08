import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Verify token and get user
    const user = await verifyToken(req, res);
    if (!user) return;

    // Role check
    checkRole(["admin", "system-admin"])(req, res, async () => {
      const { id } = req.query;

      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
