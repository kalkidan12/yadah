import connectDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  const user = await verifyToken(req, res);
  if (!user) return; // 401 already sent

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}
