import express from "express";
import sendEmail from '../utils/email';
import { prisma } from "../../prisma/client";
import { createToken, verifyToken } from "../utils/jwt";
import { requiredAuth } from "../middleware/requiredAuth";

const router = express.Router();

const error = {
  email: 'The email you entered doesn\'t belong to an account. Please check your email and try again.',
  password: 'Sorry, your password was incorrect. Please double-check your password.',
  missing: 'Sorry, you are missing some required fields. Please try again.',
}


router.post('/auth', async (req, res) => {

  // validate body
  const body = { ...req.body };
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: error.missing });
  }

  // check if user exists
  const user = await prisma.admin.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: error.email });
  }
  // check if password is not correct
  if (user.password !== password) {
    return res.status(401).json({ error: error.password });
  }
  // // generate token
  const token = createToken({ admin: user.id }, { role: 'ADMIN' });
  // send token
  res.json({ token });
});


router.post('/create', requiredAuth({ role: 'ADMIN' }), async (req, res) => {

  const body = { ...req.body };

  const centerId = body.centerId;

  // check if center exists
  const Center = await prisma.center.findUnique({ where: { id: centerId }, include: { subadmin: true } });

  if (!Center) {
    return res.status(400).json({ error: 'Center does not exist' });
  }

  if (Center.subadmin) {
    return res.status(400).json({ error: 'Center already has a subadmin' });
  }

  const subadmin = await prisma.subadmin.create({ data: body });
  const subadminToken = createToken(subadmin, { role: 'SUBADMIN' });
  const authUrl = `${process.env.APP_URL}/subadmin/confirmation/${subadminToken}`;
  const info = await sendEmail('holasamilol@gmail.com', authUrl);

  res.json({
    data: subadmin,
    message: 'subadmin created successfully',
    inbox: "https://mail.google.com/mail/u/0/#inbox",
  });
}
);


router.post('/delete', requiredAuth({ role: 'ADMIN' }), async (req, res) => {
  // validate body
  const body = { ...req.body };

  const subadminId = body.subadminId;

  // check if subadmin exists
  const subadmin = await prisma.subadmin.findUnique({ where: { id: subadminId } });

  if (!subadmin) {
    return res.status(400).json({ error: 'Subadmin does not exist' });
  }

  const deleted = await prisma.subadmin.delete({ where: { id: subadminId } });

  res.json({
    data: deleted,
    message: 'Subadmin deleted successfully',
  });

});



export { router };