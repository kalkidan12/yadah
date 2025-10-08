import jwt from "jsonwebtoken";
import Auth from "../../models/Auth";

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized." });
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from DB
    const user = await Auth.findById(decoded.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return null;
    }

    // Attach user to request
    req.user = user;
    return user;
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token." });
    return null;
  }
};

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User information not found. Unauthorized." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};
