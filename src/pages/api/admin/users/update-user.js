import connectDB from "@/lib/mongodb";
import User from "@/models/User";
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
    checkRole(["admin", "system-admin"])(req, res, async () => {
      const { id } = req.query;
      const {
        fullName,
        phoneNumber,
        emailAddress,
        dateOfBirth,
        gender,
        maritalStatus,
        numberOfChildren,
        residentialAddress,
        workAddress,
        educationalBackground,
        occupation,
        skills,
        localChurchName,
        localChurchAddress,
        roleInLocalChurch,
        roleInYadahMinistry,
        batchInYadahMinistry,
      } = req.body;

      if (!fullName || !phoneNumber) {
        return res.status(400).json({
          message: "Full name and phone number are required.",
        });
      }

      try {
        // Check if another user has the same emailAddress
        if (emailAddress) {
          const existingUser = await User.findOne({
            emailAddress,
            _id: { $ne: id },
          });
          if (existingUser) {
            return res
              .status(409)
              .json({ message: "Email is already in use." });
          }
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            fullName,
            phoneNumber,
            emailAddress,
            dateOfBirth,
            gender,
            maritalStatus,
            numberOfChildren,
            residentialAddress,
            workAddress,
            educationalBackground,
            occupation,
            skills,
            localChurchName,
            localChurchAddress,
            roleInLocalChurch,
            roleInYadahMinistry,
            batchInYadahMinistry,
          },
          { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ message: "Failed to update user." });
      }
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
