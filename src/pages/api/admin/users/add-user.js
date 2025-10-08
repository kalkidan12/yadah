import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

await connectDB();

const generateCustomId = async () => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const userId = `YADAH${randomDigits}`;
  const exists = await User.findOne({ userId });
  if (exists) return generateCustomId();
  return userId;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const user = await verifyToken(req, res);
    if (!user) return;

    checkRole(["admin", "system-admin"])(req, res, async () => {
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

      // Check if email already exists
      if (emailAddress) {
        const existingUser = await User.findOne({ emailAddress });
        if (existingUser) {
          return res
            .status(409)
            .json({ message: "A user with this email already exists." });
        }
      }

      const newUser = new User({
        userId: await generateCustomId(),
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
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Failed to add user." });
  }
}
