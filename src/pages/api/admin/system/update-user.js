import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Verify token and get user
    const user = await verifyToken(req, res);
    if (!user) return;

    // Check role
    checkRole(["system-admin"])(req, res, async () => {
      const { id } = req.query;
      const { firstName, lastName, email, role, newPassword } = req.body;

      if (!firstName || !lastName || !email || !role) {
        return res.status(400).json({
          message: "First name, last name, email, and role are required.",
        });
      }

      try {
        // Check if the user exists
        const authUser = await Auth.findById(id);
        if (!authUser) {
          return res.status(404).json({ message: "User not found." });
        }

        // Check if email is already in use by another user
        const existingUser = await Auth.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
          return res.status(409).json({ message: "Email is already in use." });
        }

        // Update fields
        authUser.firstName = firstName;
        authUser.lastName = lastName;
        authUser.email = email;
        authUser.role = role;

        if (newPassword) {
          authUser.password = newPassword;
        }

        await authUser.save();

        res.status(200).json({
          id: authUser._id,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          email: authUser.email,
          role: authUser.role,
        });
      } catch (error) {
        console.error("Failed to update Auth user:", error);
        res.status(500).json({ message: "Failed to update Auth user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
