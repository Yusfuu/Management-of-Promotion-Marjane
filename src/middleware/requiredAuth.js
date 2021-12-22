import { verifyToken } from "../utils/jwt";

export const requiredAuth = (role = {}) => async (req, res, next) => {
  const error = {
    invalid: 'Access denied. Please try logging in again.',
    missing: 'Access denied. No token provided.',
  }

  const bearer = req?.headers?.authorization;

  if (!bearer) {
    return res.status(401).json({ error: error.missing });
  }

  const token = bearer.split(" ")[1];

  const decoded = verifyToken(token, role);

  if (!decoded) {
    return res.status(401).json({ error: error.invalid });
  }

  req.currentUser = { ...decoded };
  next();
}