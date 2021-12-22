import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";

const router = express.Router();

router.get('/auth/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const sub = jwt.verify(token, process.env.APP_KEY_SUBADMIN);

    const updateSubadmin = await prisma.subadmin.update({
      where: { id: sub.id },
      data: { isEmailVerified: true },
    });

    res.json({ updateSubadmin });
  } catch (error) {
    res.status(401).json({
      error: 'invalid credentials',
    });
  }

});

export { router };
