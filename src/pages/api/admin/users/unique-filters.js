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
      const occupations = await User.distinct("occupation");
      const skills = await User.distinct("skills");
      const localChurches = await User.distinct("localChurchName");
      const rolesInLocalChurch = await User.distinct("roleInLocalChurch");
      const rolesInYadahMinistry = await User.distinct("roleInYadahMinistry");
      const educationalBackgrounds = await User.distinct(
        "educationalBackground"
      );
      const batchesInYadah = await User.distinct("batchInYadahMinistry");

      res.status(200).json({
        occupations,
        skills,
        localChurches,
        rolesInLocalChurch,
        rolesInYadahMinistry,
        educationalBackgrounds,
        batchesInYadah,
      });
    });
  } catch (error) {
    console.error("Error fetching unique filters:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
