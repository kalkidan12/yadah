import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
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
    checkRole(["system-admin"])(req, res, async () => {
      const { id } = req.query;

      try {
        const authUser = await Auth.findById(id).select(
          "-password -resetOTP -resetOTPExpiry -refreshToken"
        );

        if (!authUser) {
          return res.status(404).json({ message: "Auth user not found." });
        }

        res.status(200).json(authUser);
      } catch (error) {
        console.error("Error fetching Auth user:", error);
        res.status(500).json({ message: "Failed to fetch Auth user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
