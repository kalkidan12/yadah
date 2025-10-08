import connectDB from "@/lib/mongodb";
import User from "@/models/User";
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

    checkRole(["admin", "system-admin"])(req, res, async () => {
      // Total users
      const totalUsers = await User.countDocuments();

      // New users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const newUsersThisMonth = await User.countDocuments({
        createdAt: { $gte: startOfMonth },
      });

      // Gender distribution
      const genderAgg = await User.aggregate([
        { $group: { _id: "$gender", count: { $sum: 1 } } },
      ]);

      const maleUsers = genderAgg.find((g) => g._id === "Male")?.count || 0;
      const femaleUsers = genderAgg.find((g) => g._id === "Female")?.count || 0;

      // Marital status distribution
      const maritalDistributionRaw = await User.aggregate([
        { $group: { _id: "$maritalStatus", count: { $sum: 1 } } },
      ]);
      const maritalDistribution = maritalDistributionRaw.map((m) => ({
        status: m._id,
        count: m.count,
      }));

      // Occupation counts
      const occupationCountsRaw = await User.aggregate([
        { $group: { _id: "$occupation", count: { $sum: 1 } } },
      ]);
      const occupationCounts = occupationCountsRaw.map((o) => ({
        occupation: o._id,
        count: o.count,
      }));

      // Batch in Yadah Ministry counts
      const batchCountsRaw = await User.aggregate([
        { $group: { _id: "$batchInYadahMinistry", count: { $sum: 1 } } },
      ]);
      const batchCounts = batchCountsRaw.map((b) => ({
        batch: b._id,
        count: b.count,
      }));

      // Roles in Yadah Ministry
      const rolesInYadahRaw = await User.aggregate([
        { $unwind: "$roleInYadahMinistry" },
        { $group: { _id: "$roleInYadahMinistry", count: { $sum: 1 } } },
      ]);
      const rolesInYadahMinistry = rolesInYadahRaw.map((r) => ({
        role: r._id,
        count: r.count,
      }));

      // System-admin extra data
      let authStats = null;
      if (user.role === "system-admin") {
        const totalAuthUsers = await Auth.countDocuments();
        const totalAdmins = await Auth.countDocuments({ role: "admin" });
        const totalSystemAdmins = await Auth.countDocuments({
          role: "system-admin",
        });

        authStats = {
          totalAuthUsers,
          totalAdmins,
          totalSystemAdmins,
        };
      }

      res.status(200).json({
        totalUsers,
        maleUsers,
        femaleUsers,
        newUsersThisMonth,
        maritalDistribution,
        occupationCounts,
        batchCounts,
        rolesInYadahMinistry,
        authStats, // will be null for regular admins
      });
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
