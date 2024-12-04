import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRETKEY || "Santosh";

const prisma = new PrismaClient();

const owners = Router();

owners.post("/signup", async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingOwner = await prisma.owners.findUnique({
      where: { email: email },
    });

    if (existingOwner) {
      return res.json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Create a new owner
    await prisma.owners.create({
      data: {
        name,
        email,
        password,
      },
    });

    const token = jwt.sign({ email }, SECRET);
    res.json({
      token,
      success: true,
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message,
    });
  }
});

owners.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const getOwner = await prisma.owners.findFirst({
      where: { email: email, password: password },
    });

    if (!getOwner) {
      return res.json({
        message: "No such user found",
        success: false,
      });
    }

    const token = jwt.sign(getOwner.email, SECRET);
    return res.json({
      token,
      success: true,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

owners.get("/verify", (req: any, res: any) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const verify = jwt.verify(token, SECRET);
    if (!verify) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    return res.json({
      success: true,
    });
  } catch (e: any) {
    return res.json({
      message: e.message,
      success: false,
    });
  }
});
export default owners;
