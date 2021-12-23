import express from "express";
import sendEmail from '../utils/email';
import { prisma } from "../../prisma/client";
import { createToken, verifyToken } from "../utils/jwt";
import { requiredAuth } from "../middleware/requiredAuth";


const router = express.Router();



export { router };