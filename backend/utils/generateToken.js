import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const generateToken = async (userId) => {
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  console.log(secretKey);
  const token = await jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
};

export const verifyToken = async (token) => {
  
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  return await jwt.verify(token, secretKey);
};
