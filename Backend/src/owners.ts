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

    const token = jwt.sign({ email, isOwner: true }, SECRET);
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

    const token = jwt.sign({ email, isOwner: true }, SECRET);
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

    const verify = jwt.verify(token, SECRET) as {
      email: string;
      isOwner: boolean;
    };
    if (!verify) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    if (!verify.isOwner) {
      return res.json({
        success: false,
        message: "Not an owner/admin",
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

owners.post("/details", async (req: any, res: any) => {
  try {
    const token = req.body.token;
    // console.log("Token I got from profile page is " + token);

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    // console.log(token);

    const verifyPerson = await jwt.verify(token, SECRET);
    // console.log("Error is not above");
    // console.log("Verify Person got me  " + verifyPerson);

    if (!verifyPerson) {
      return res.json({
        success: false,
        message: "Cannot verify admin",
      });
    }

    const getPerson = await prisma.owners.findFirst({
      where: {
        email: verifyPerson as string,
      },
    });

    if (!getPerson) {
      return res.json({
        success: false,
        message: "No such user found",
      });
    }

    // console.log(
    //   "Got the person with these details " +
    //     getPerson.name +
    //     " " +
    //     getPerson.email
    // );

    return res.json({
      success: true,
      details: getPerson,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});
export default owners;
