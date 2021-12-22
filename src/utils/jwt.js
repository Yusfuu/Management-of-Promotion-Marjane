import jwt from "jsonwebtoken";

export const createToken = (payload = null, { role = 'SUBADMIN' }) => {
  if (!payload) return null;

  const key = role === 'ADMIN' ? process.env.APP_KEY_ADMIN : process.env.APP_KEY_SUBADMIN;

  return jwt.sign(payload, key, { expiresIn: "1h" });
};

export const verifyToken = (token = null, { role = 'SUBADMIN' }) => {
  if (!token) return null;

  const key = role === 'ADMIN' ? process.env.APP_KEY_ADMIN : process.env.APP_KEY_SUBADMIN;

  try {
    return jwt.verify(token, key);
  } catch (error) {
    return null;
  }
};


// export const validateToken = (req, res, next) => {
//   const bearer = req?.headers?.authorization;
//   if (!bearer) {
//     return res.status(401).json({
//       error: "Access denied. No token provided."
//     });
//   }
//   const token = bearer.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.APP_KEY_ADMIN);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       error: "Invalid token."
//     });
//   }
// };