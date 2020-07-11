import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const getUserFromJWT = (bearer='') => {
  try {
    const token = bearer.split(' ')[1]
    if (token) return jwt.verify(token, process.env.JWT_SECRET)
    return null
  } catch (error) {
    return null
  }
}

const prisma = new PrismaClient()

const createContext = ({ req, connection }) => {
  const { authorization } = req ? req.headers : connection.context
  return { user: getUserFromJWT(authorization), prisma };
}

export default createContext;
export { prisma }