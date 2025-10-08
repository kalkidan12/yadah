import connectDB from "@/lib/mongodb";
import Auth from "@/models/Auth";
import { verifyToken, checkRole } from "@/lib/middleware/auth";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const user = await verifyToken(req, res);
    if (!user) return;

    checkRole(["system-admin"])(req, res, async () => {
      const {
        page = 1,
        limit = 10,
        sortField = "createdAt",
        sortOrder = "desc",
        searchTerm = "",
        role = "",
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const pageLimit = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageLimit;

      // Build search filter
      const filterOptions = { _id: { $ne: user._id } }; // exclude self
      if (searchTerm) {
        filterOptions.$or = [
          { firstName: { $regex: searchTerm, $options: "i" } },
          { lastName: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // Role filter
      if (role) filterOptions.role = role;

      // Sorting
      const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

      // Fetch users
      const users = await Auth.find(filterOptions)
        .skip(skip)
        .limit(pageLimit)
        .sort(sortOptions)
        .select("-password -resetOTP -resetOTPExpiry -refreshToken");

      const totalUsers = await Auth.countDocuments(filterOptions);
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
    console.error("Error fetching system-admin users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
