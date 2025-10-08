import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const user = await verifyToken(req, res);
    if (!user) return;

    checkRole(["admin", "system-admin"])(req, res, async () => {
      const {
        page = 1,
        limit = 10,
        sortField = "createdAt",
        sortOrder = "desc",
        searchTerm = "",
        gender,
        maritalStatus,
        occupation,
        skills,
        localChurchName,
        roleInLocalChurch,
        roleInYadahMinistry,
        educationalBackground,
        batchInYadahMinistry,
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const pageLimit = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageLimit;

      // Build filter object
      const filterOptions = {};

      if (searchTerm) {
        filterOptions.$or = [
          { fullName: { $regex: searchTerm, $options: "i" } },
          { emailAddress: { $regex: searchTerm, $options: "i" } },
          { phoneNumber: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (gender) filterOptions.gender = gender;
      if (maritalStatus) filterOptions.maritalStatus = maritalStatus;
      if (occupation) filterOptions.occupation = occupation;
      if (skills) filterOptions.skills = skills;
      if (localChurchName) filterOptions.localChurchName = localChurchName;
      if (roleInLocalChurch)
        filterOptions.roleInLocalChurch = roleInLocalChurch;
      if (roleInYadahMinistry)
        filterOptions.roleInYadahMinistry = roleInYadahMinistry;
      if (educationalBackground)
        filterOptions.educationalBackground = educationalBackground;
      if (batchInYadahMinistry)
        filterOptions.batchInYadahMinistry = batchInYadahMinistry;

      // Sorting
      const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

      // Fetch users
      const users = await User.find(filterOptions)
        .skip(skip)
        .limit(pageLimit)
        .sort(sortOptions)
        .select("-password");

      const totalUsers = await User.countDocuments(filterOptions);
      const totalPages = Math.ceil(totalUsers / pageLimit);

      res.status(200).json({
        users,
        totalUsers,
        page: pageNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
      });
    });
  } catch (error) {
    console.error("Error in get-users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
