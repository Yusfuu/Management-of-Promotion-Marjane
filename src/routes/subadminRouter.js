import express from "express";
import { prisma } from "../../prisma/client";
import { requiredAuth, promotionTime } from "../middleware/";
import sendEmail from "../utils/email";
import { createToken, verifyToken } from "../utils/jwt";

const router = express.Router();


router.get('/confirmation/:token', async (req, res) => {
  const { token } = req.params;
  const subadmin = verifyToken(token, { role: 'SUBADMIN' })

  if (!subadmin) {
    return res.status(401).json({ error: 'something went wrong' });
  }

  const updateSubadmin = await prisma.subadmin.update({
    where: { id: subadmin.id },
    data: { isEmailVerified: true },
    select: { email: true, password: true }
  });

  res.json({
    message: 'email verified',
    credentials: updateSubadmin
  });

});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const subadmin = await prisma.subadmin.findUnique({ where: { email } });

  if (!subadmin) {
    return res.status(401).json({ error: 'email does not exist' });
  }

  if (!subadmin.isEmailVerified) {
    return res.status(401).json({ error: 'Email not verified please check your mailbox' });
  }

  if (subadmin.password !== password) {
    return res.status(401).json({ error: 'password is incorrect' });
  }

  const sub = {
    id: subadmin.id,
    email: subadmin.email,
    centerId: subadmin.centerId,
  }

  const token = createToken(sub, { role: 'SUBADMIN' });

  res.json({ token });
});

// middleware for promotionTime

// router.use(promotionTime);

router.post('/promotion/create', requiredAuth({ role: 'SUBADMIN' }), async (req, res) => {
  const body = { ...req.body };

  const { productId, discount } = body;
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { Promotion: true, Category: true } });



  if (!product) {
    return res.status(400).json({ error: 'Product does not exist' });
  }

  if (product.Promotion) {
    return res.status(400).json({ error: 'Product already has a promotion' });
  }

  if (discount > 50) {
    return res.status(400).json({ error: 'Discount cannot be more than 50' });
  }


  if (product.Category.name === 'Multimedia' && discount > 20) {
    return res.status(400).json({ error: 'Discount cannot be more than 20 for Multimedia' });
  }

  const promotion = await prisma.promotion.create({
    data: {
      discount,
      productId,
      subadminId: req.currentUser.id,
      FidelityCard: (discount / 5) * 50
    }
  });

  res.json({ promotion });
});



router.post('/manger/create', requiredAuth({ role: 'SUBADMIN' }), async (req, res) => {
  const body = { ...req.body };
  const { email, password, categoryId } = body;

  const manger = {
    email,
    password,
    categoryId,
    centerId: req.currentUser.centerId
  }

  const mangerCreated = await prisma.manager.create({
    data: manger
  });


  const mangerToken = createToken(mangerCreated, { role: 'MANGER' });

  const authUrl = `${process.env.APP_URL}/manger/confirmation/${mangerToken}`;
  const info = await sendEmail('holasamilol@gmail.com', authUrl);

  res.json({
    data: mangerCreated,
    message: 'manger created successfully',
    inbox: "https://mail.google.com/mail/u/0/#inbox",
  });

});


export { router };
