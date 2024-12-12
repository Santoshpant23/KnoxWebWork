import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";

// Instantiate the client
const prisma = new PrismaClient();

const exercise = Router();

const SECRET = process.env.SECRETKEY || "Santosh";

exercise.get("/", (req, res) => {
  res.send("Welcome to exercise endpoint");
});

exercise.get("/all-exercises", async (req: any, res: any) => {
  try {
    const { token, cookie } = req.body;
    if (!token && !cookie) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    //not doing anything for admin for now, just focusing on students
    //somehow decoding cookie and making sure the user is authenticated to be here

    //here, I will eventually make sure date of release is actually considered while showing the exercises to the students
    const courseId = await req.body.courseId;
    const allExercises = prisma.exercise.findMany({
      where: {
        courseId: courseId,
      },
    });

    return res.json({
      success: true,
      message: "Success",
      exercises: allExercises,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

exercise.post("/add-exercise", async (req: any, res: any) => {
  try {
    const { token, courseId } = req.body;

    if (!token || !courseId) {
      return res.json({
        success: false,
        message: "Unauthorized Action",
      });
    }

    const verifyToken = jwt.verify(token, SECRET);

    if (!verifyToken) {
      return res.json({
        success: false,
        message: "Cannot verify user",
      });
    }

    const getOwner = prisma.owners.findFirst({
      where: {
        email: verifyToken as string,
      },
    });

    if (!getOwner) {
      return res.json({
        success: false,
        message: "User does not exist, please signup",
      });
    }

    const course = prisma.course.findFirst({
      where: {
        id: courseId,
        ownedBy: verifyToken as string,
      },
    });

    if (!course) {
      return res.json({
        success: false,
        message: "Course does not exist",
      });
    }

    const { name, datePosted, dateExpires } = req.body;

    if (!name || !datePosted || !dateExpires) {
      return res.json({
        success: false,
        message: "Insufficient Information Provided",
      });
    }

    /*
    model Exercise {
  id          Int        @id @default(autoincrement())
  name        String     @unique
  datePosted  DateTime
  dateExpires DateTime
  questions   Question[]
  courseId    Int
  course      Course     @relation(fields: [courseId], references: [id])
}

  */
    const exercise = await prisma.exercise.create({
      data: {
        name: name,
        datePosted: datePosted,
        dateExpires: dateExpires,
        courseId: courseId,
      },
    });

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        exercises: {
          connect: { id: exercise.id },
        },
      },
    });

    return res.json({
      success: true,
      message: "Success",
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

exercise.post("/get-exercise", async (req: any, res: any) => {
  try {
    const token = req.body.token;
    const id = req.body.id;

    const verifyToken = jwt.verify(token, SECRET) as string;
    if (!verifyToken) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const findExercise = await prisma.exercise.findFirst({
      where: {
        id: id,
      },
      include: {
        questions: true,
      },
    });

    if (!findExercise) {
      return res.json({
        success: false,
        message: "Invalid Course selected",
      });
    }

    const CourseIdOfThisExercise = findExercise.courseId;

    const findTheOwnerOfThisCourse = await prisma.course.findFirst({
      where: {
        id: CourseIdOfThisExercise,
      },
    });

    if (!findTheOwnerOfThisCourse) {
      return res.json({
        success: false,
        message: "Invalid Action, try again",
      });
    }

    if (findTheOwnerOfThisCourse.ownedBy != verifyToken) {
      return res.json({
        success: false,
        message: "Not Authorized",
      });
    }

    return res.json({
      success: true,
      exercise: findExercise,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

export default exercise;
