import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRETKEY || "Santosh";

// Instantiate the client
const prisma = new PrismaClient();

const question = Router();

question.get("/", (req, res) => {
  res.send("Welcome to question endpoint");
});

question.post("/add", async (req: any, res: any) => {
  try {
    const { token, exerciseId } = req.body;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    if (!exerciseId) {
      return res.json({
        success: false,
        message: "Something went wrong, no exercise context provided",
      });
    }

    const verifyToken = jwt.verify(token, SECRET) as string;
    if (!verifyToken) {
      return res.json({
        success: false,
        message: "Cannot verify user, please re-login",
      });
    }

    const getExercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
      },
    });

    if (!getExercise) {
      return res.json({
        success: false,
        message: "Invalid Exercise, or the exercise no longer exist",
      });
    }

    const courseID = getExercise.courseId;

    const checkCourse = await prisma.course.findFirst({
      where: {
        id: courseID,
      },
    });

    if (!checkCourse) {
      return res.json({
        success: false,
        message:
          "Exercise does not belong to any course, something is wrong with given exerciseId",
      });
    }

    if (checkCourse.ownedBy != verifyToken) {
      return res.json({
        success: false,
        message:
          "Unauthorized Action, you have no such course associated to your profile",
      });
    }

    const qn = req.body.qn;
    const options: string[] = req.body.options;
    const correct: number = req.body.correct;

    if (!qn || !options) {
      return res.json({
        success: false,
        message: "Please provide qn and options",
      });
    }
    console.log(correct);

    if (correct === null || correct === undefined) {
      return res.json({
        success: false,
        message: "Please give correct answer",
      });
    }

    await prisma.question.create({
      data: {
        question: qn,
        options: options,
        correct: correct,
        exerciseId: exerciseId,
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

question.get("/checkans", async (req: any, res: any) => {
  try {
    //todo: implement logic to check answer
    //----------------
    const cookie = req.body.cookie;
    //logic to verify if a student is logged in or not
    const { questionId, option } = req.body;
    const getQn = await prisma.question.findFirst({
      where: {
        id: questionId,
      },
    });

    if (!getQn) {
      return res.json({
        success: false,
        message: "Question not found :(",
      });
    }

    if (option == getQn.correct) {
      return res.json({
        success: true,
        isCorrect: true,
      });
    }

    return res.json({
      success: true,
      isCorrect: false,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
});

question.delete("/delete", async (req: any, res: any) => {
  try {
    const { token, id } = req.body;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Action",
      });
    }

    const verifyToken = jwt.verify(token, SECRET) as string;
    if (!verifyToken) {
      return res.json({
        success: false,
        message: "Invalid Login, please try logging in again",
      });
    }

    const getQnOutOfId = await prisma.question.findFirst({
      where: {
        id: id,
      },
    });

    if (!getQnOutOfId) {
      return res.json({
        success: false,
        message: "No such qn found",
      });
    }

    const getExercise = await prisma.exercise.findFirst({
      where: {
        id: getQnOutOfId.exerciseId,
      },
    });

    if (!getExercise) {
      return res.json({
        success: false,
        message:
          "No associated exercise found to this qn, something went wrong",
      });
    }

    const getCourse = await prisma.course.findFirst({
      where: {
        id: getExercise.courseId,
      },
    });

    if (!getCourse) {
      return res.json({
        success: false,
        message:
          "No such course found that this qn belong to, something went wrong",
      });
    }

    if (verifyToken != getCourse.ownedBy) {
      return res.json({
        success: false,
        message: "Invalid Action, try again",
      });
    }

    await prisma.question.delete({
      where: {
        id: id,
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

question.post("/update-qn", async (req: any, res: any) => {
  try {
    const { token, exerciseId, questionId } = req.body;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    if (!exerciseId) {
      return res.json({
        success: false,
        message: "Something went wrong, no exercise context provided",
      });
    }

    const verifyToken = jwt.verify(token, SECRET) as string;
    if (!verifyToken) {
      return res.json({
        success: false,
        message: "Cannot verify user, please re-login",
      });
    }

    const getExercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
      },
    });

    if (!getExercise) {
      return res.json({
        success: false,
        message: "Invalid Exercise, or the exercise no longer exist",
      });
    }

    const courseID = getExercise.courseId;

    const checkCourse = await prisma.course.findFirst({
      where: {
        id: courseID,
      },
    });

    if (!checkCourse) {
      return res.json({
        success: false,
        message:
          "Exercise does not belong to any course, something is wrong with given exerciseId",
      });
    }

    if (checkCourse.ownedBy != verifyToken) {
      return res.json({
        success: false,
        message:
          "Unauthorized Action, you have no such course associated to your profile",
      });
    }

    const getQn = await prisma.question.findFirst({
      where: {
        id: questionId,
      },
    });

    if (!getQn) {
      return res.json({
        success: false,
        message: "Cannot find this qn, something went wrong",
      });
    }

    const qn = req.body.qn;
    const options: string[] = req.body.options;
    const correct: number = req.body.correct;

    if (!qn || !options) {
      return res.json({
        success: false,
        message: "Please provide qn and options",
      });
    }

    if (correct === null || correct === undefined) {
      return res.json({
        success: false,
        message: "Please give correct answer",
      });
    }

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        question: qn,
        options: options,
        correct: correct,
        exerciseId: exerciseId,
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

export default question;
