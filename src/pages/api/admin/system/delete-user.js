import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
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
    checkRole(["system-admin"])(req, res, async () => {
      const { id } = req.query;

      try {
        const deletedAuth = await Auth.findByIdAndDelete(id);

        if (!deletedAuth) {
          return res.status(404).json({ message: "Auth user not found." });
        }

        res.status(200).json({ message: "Auth user deleted successfully." });
      } catch (error) {
        console.error("Error deleting Auth user:", error);
        res.status(500).json({ message: "Failed to delete Auth user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
