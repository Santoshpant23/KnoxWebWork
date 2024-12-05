import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRETKEY || "Santosh";

// Instantiate the client
const prisma = new PrismaClient();

const course = Router();

course.get("/", (req, res) => {
  res.send(
    "Welcome to courses endpoint " +
      SECRET +
      " is the secret no one should know"
  );
});

course.get("/allcourses", async (req: Request, res: Response) => {
  try {
    const allCourses = await prisma.course.findMany();
    res.json({ courses: allCourses, success: true });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message(),
    });
  }
});

course.post("/add-course", async (req, res) => {
  try {
    const token = req.body.token;
    const verifyToken = jwt.verify(token, SECRET);
    if (!verifyToken) {
      res.json({
        message: "Invalid Token",
        success: false,
      });
    }

    const owner = verifyToken;

    const getOwner = await prisma.owners.findFirst({
      where: { email: verifyToken as string },
    });

    if (!getOwner) {
      res.json({
        message: "Owner not found",
        success: false,
      });
    }

    console.log(getOwner?.email);

    /*
    model Course {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  term      String
  students  Student[]
  exercises Exercise[]
  ownedBy   String
  owner     Owners     @relation(fields: [ownedBy], references: [email])
}
    */

    const { name, term } = req.body;

    console.log(name + " " + term);

    if (!name || !term) {
      res.json({
        success: false,
        message: "Fields cannot be empty",
      });
    }

    await prisma.course.create({
      data: {
        name: name,
        term: term,
        ownedBy: owner as string,
      },
    });
    res.json({
      success: true,
      message: "Course added to the courses list",
    });
  } catch (e: any) {
    res.json({
      message: e.message,
      success: false,
    });
  }
});

course.post("/mycourses", async (req: any, res: any) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const verifyToken = (await jwt.verify(token, SECRET)) as { email: string };
    if (!verifyToken) {
      return res.json({
        message: "Cannot verify user, try again",
        success: false,
      });
    }

    const findAllCourses = await prisma.course.findMany({
      where: {
        ownedBy: verifyToken.email,
      },
    });

    return res.json({
      courses: findAllCourses,
      success: true,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

export default course;
