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
    const verifyToken = jwt.verify(token, SECRET) as { email: string };
    if (!verifyToken) {
      res.json({
        message: "Invalid Token",
        success: false,
      });
    }

    const getOwner = await prisma.owners.findFirst({
      where: { email: verifyToken.email },
    });

    if (!getOwner) {
      res.json({
        message: "Owner not found",
        success: false,
      });
    }

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
        ownedBy: verifyToken.email,
      },
    });
    res.json({
      success: true,
      message: "Course added to the courses list",
    });
  } catch (e: any) {
    res.json({
      message: e.message(),
      success: false,
    });
  }
});

export default course;
