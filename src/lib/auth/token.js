import jwt from "jsonwebtoken";
import Auth from "../../models/Auth";

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined."
  );
}

// Access Token: short-lived
export const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

// Refresh Token: long-lived
export const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

// Refresh token logic
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required." });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await Auth.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token to DB
    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};
