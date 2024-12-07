import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRETKEY || "Santosh";

// Instantiate the client
const prisma = new PrismaClient();

const student = Router();

student.get("/", (req, res) => {
  res.send("Welcome to student endpoint");
});

student.post("/add-students", async (req: any, res: any) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Action, please login",
      });
    }

    const verifyToken = jwt.verify(token, SECRET);
    if (!verifyToken) {
      return res.json({
        success: false,
        message:
          "Cannot verify user, please login with appropriate credentials",
      });
    }

    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res.json({
        success: false,
        message: "All information related to students must be provided",
      });
    }

    const courseId = req.body.courseId;
    if (!courseId) {
      return res.json({
        success: false,
        message: "Please select a course before adding students",
      });
    }

    const getCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        ownedBy: verifyToken as string,
      },
    });

    if (!getCourse) {
      return res.json({
        success: false,
        message: "Unauthorized Action, please try again",
      });
    }

    const student = await prisma.student.create({
      data: {
        username: username,
        password: password,
        name: name,
        courseId: courseId,
      },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          connect: { id: student.id },
        },
      },
    });

    return res.json({
      success: true,
      message:
        "A student login details has been added in the database successfully",
    });
    /*
    model Student {
  username String @unique
  password String
  name     String
  courseId Int
  course   Course @relation(fields: [courseId], references: [id])
}
  */
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

student.get("/login", async (req: any, res: any) => {
  try {
    const { username, password, courseId } = req.body;

    if (!username || !password || !courseId) {
      return res.json({
        success: false,
        message: "Please give all information correctly",
      });
    }

    const searchUser = await prisma.student.findFirst({
      where: {
        courseId: courseId,
        username: username,
        password: password,
      },
    });

    if (!searchUser) {
      return res.json({
        success: false,
        message: "No such user found in this course :(",
      });
    }

    //make a session cookie and send it to the user
    //todo

    return res.json({
      success: true,
      message: "Success",
      cookie: "raanaoifuoiasudfoaijfdcaosiudfaoi",
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

student.get("./verify", (req: any, res: any) => {
  try {
    const cookie = req.body.cookie;
    //will verift later and will do this part later
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

student.post("/update-student", async (req: any, res: any) => {
  try {
    const token = req.body.token;
    const verifyToken: string = (await jwt.verify(token, SECRET)) as string;
    if (!verifyToken) {
      return res.json({
        success: false,
        message: "Unauthorized Action",
      });
    }

    const { username, password, name, id } = req.body.studentInfo;

    if (!username || !password || !name) {
      return res.json({
        success: false,
        message: "All information related to students must be provided",
      });
    }

    const courseId = req.body.courseId;
    if (!courseId) {
      return res.json({
        success: false,
        message: "Please select a course before adding students",
      });
    }

    const getCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        ownedBy: verifyToken as string,
      },
    });

    if (!getCourse) {
      return res.json({
        success: false,
        message: "Unauthorized Action, please try again",
      });
    }

    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        password: password,
        name: name,
      },
    });

    // await prisma.course.update({
    //   where: { id: courseId },
    //   data: {
    //     students: {
    //       connect: { id: student.id },
    //     },
    //   },
    // });

    return res.json({
      success: true,
      message: "Student Info has been updated successfully",
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

export default student;
