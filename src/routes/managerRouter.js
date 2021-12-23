import express from "express";
import { prisma } from "../../prisma/client";
import { createToken, verifyToken } from "../utils/jwt";
import { requiredAuth } from "../middleware/requiredAuth";

const router = express.Router();

router.get('/confirmation/:token', async (req, res) => {
  const { token } = req.params;
  const manger = verifyToken(token, { role: 'MANGER' })

  if (!manger) {
    return res.status(401).json({ error: 'something went wrong' });
  }

  const updateManger = await prisma.manager.update({
    where: { id: manger.id },
    data: { isEmailVerified: true },
    select: { email: true, password: true }
  });

  res.json({
    message: 'email verified',
    credentials: updateManger
  });

});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const manager = await prisma.manager.findUnique({ where: { email } });

  if (!manager) {
    return res.status(401).json({ error: 'email does not exist' });
  }

  if (!manager.isEmailVerified) {
    return res.status(401).json({ error: 'Email not verified please check your mailbox' });
  }

  if (manager.password !== password) {
    return res.status(401).json({ error: 'password is incorrect' });
  }

  delete manager.password;

  const token = createToken(manager, { role: 'MANGER' });

  res.json({ token });
});



router.get('/promotions', requiredAuth({ role: 'MANGER' }), async (req, res) => {
  const manger = { ...req.currentUser };

  const promotions = await prisma.promotion.findMany({
    where: {
      product: { categoryId: { equals: manger.categoryId } },
      subadmin: { centerId: { equals: manger.centerId } }
    }
  }).catch(_ => _);

  res.json({ promotions });
});

router.put('/promotion', requiredAuth({ role: 'MANGER' }), async (req, res) => {
  const { promotionId, confirmation } = { ...req.body };

  const updatePromotion = await prisma.promotion.update({
    where: { id: promotionId },
    data: { confirmation }
  }).catch(_ => _);

  res.json({ updatePromotion });
});


export { router };