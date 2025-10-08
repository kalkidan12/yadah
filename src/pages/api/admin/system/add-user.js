import { checkRole, verifyToken } from "@/lib/middleware/auth";
import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Verify token and get user
    const user = await verifyToken(req, res);
    if (!user) return;

    // Role check
    checkRole(["system-admin"])(req, res, async () => {
      const { firstName, lastName, email, password, role } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          message: "First name, last name, email, and password are required.",
        });
      }

      try {
        // Check if email already exists
        const existingAuth = await Auth.findOne({ email });
        if (existingAuth) {
          return res
            .status(409)
            .json({ message: "An account with this email already exists." });
        }

        const allowedRoles = ["user", "admin", "system-admin"];
        const finalRole = allowedRoles.includes(role) ? role : "user";

        const newAuth = new Auth({
          firstName,
          lastName,
          email,
          password,
          role: finalRole,
        });

        const savedAuth = await newAuth.save();

        // Exclude sensitive fields before returning
        const {
          password: _,
          resetOTP,
          resetOTPExpiry,
          refreshToken,
          ...safeData
        } = savedAuth.toObject();

        res.status(201).json({
          message: "Auth user created successfully.",
          user: safeData,
        });
      } catch (error) {
        console.error("Error creating Auth user:", error);
        res.status(500).json({ message: "Failed to create Auth user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
