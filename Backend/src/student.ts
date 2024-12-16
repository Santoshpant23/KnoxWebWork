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

    const verifyToken = jwt.verify(token, SECRET) as {
      email: string;
      isOwner: boolean;
    };

    console.log(token);
    console.log(verifyToken);

    if (!verifyToken || !verifyToken.email || !verifyToken.isOwner) {
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
        ownedBy: verifyToken.email,
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

student.post("/login", async (req: any, res: any) => {
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

    const token = jwt.sign(
      {
        username,
        courseId,
      },
      SECRET,
      {
        expiresIn: "50m",
      }
    );

    return res.json({
      success: true,
      message: "Success",
      token,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

student.post("/verify", (req: any, res: any) => {
  try {
    const token = req.body.studentToken;
    const id = req.body.courseId;
    let usernameInfo = "";
    let courseIdInfo = "";
    if (token == null || token == undefined) {
      return res.json({
        success: false,
        message: "Unauthorized Access, Please login",
      });
    }
    if (id == null || id == undefined) {
      return res.json({
        success: false,
        message: "No Course Clicked",
      });
    }
    // console.log(token);
    let isExpired = false;
    let verify: boolean | string = true;
    jwt.verify(
      token,
      SECRET,
      function (err: jwt.VerifyErrors | null, decoded: any) {
        if (err) {
          console.log(err.message);
          verify = err.message;
          isExpired = true;
        } else {
          const { username, courseId } = decoded;
          console.log(
            courseId + " is the id from token and the id clicked is " + id
          );

          if (courseId == id) {
            usernameInfo = username;
            courseIdInfo = courseId;
          } else {
            verify = "No such user found in given course";
          }
          // Store relevant info in variables
        }
      }
    );

    if (verify !== true) {
      if (isExpired) {
        return res.json({
          success: false,
          message: verify,
          expired: true,
        });
      } else {
        return res.json({
          success: false,
          message: verify,
          expired: false,
        });
      }
    }
    return res.json({
      usernameInfo,
      courseIdInfo,
      success: true,
    });
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

student.post("/submit-answers", (req: any, res: any) => {
  try {
    const { token, question, option } = req.body;

    const verifyToken = jwt.verify(token, SECRET) as {
      username: string;
      courseId: string;
    };

    if (!verifyToken.courseId || !verifyToken.username) {
      return res.json({
        success: false,
        message: "Cannot verify user, try again",
      });
    }
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

export default student;
