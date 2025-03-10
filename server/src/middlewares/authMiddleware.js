import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("auth_token");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded; // Attach decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
