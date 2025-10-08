import connectDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/middleware/auth";
import Auth from "@/models/Auth";

await connectDB();

/**
 * @route PUT /api/profile/update-profile
 * @desc Update logged-in user's profile (and optionally password)
 * @access Private (requires Bearer token)
 */
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verify token and get user
  const user = await verifyToken(req, res);
  if (!user) return; // 401 already sent in middleware

  const { firstName, lastName, currentPassword, newPassword } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "First name and last name are required." });
  }

  try {
    const dbUser = await Auth.findById(user._id);
    if (!dbUser) return res.status(404).json({ message: "User not found." });

    // Handle password update
    if (currentPassword) {
      const isMatch = await dbUser.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }
      if (newPassword) dbUser.password = newPassword; // pre-save hook will hash
    }

    dbUser.firstName = firstName;
    dbUser.lastName = lastName;

    await dbUser.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: dbUser._id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        role: dbUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
}
