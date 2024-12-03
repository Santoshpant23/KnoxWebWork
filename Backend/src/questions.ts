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

    const verifyToken = jwt.verify(token, SECRET) as { email: string };
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

    if (checkCourse.ownedBy != verifyToken.email) {
      return res.json({
        success: false,
        message:
          "Unauthorized Action, you have no such course associated to your profile",
      });
    }

    const qn = req.body.qn;
    const options: string[] = req.body.options;
    const correct = req.body.correct;

    if (!qn || !options) {
      return res.json({
        success: false,
        message: "Please provide qn and options",
      });
    }

    if (!correct) {
      return res.json({
        success: false,
        message: "Please give correct answer",
      });
    }

    /*
    model Question {
  id         Int      @id @default(autoincrement())
  question   String   @unique @default("Choose the correct")
  options    String[]
  correct    Int
  exerciseId Int
  exercise   Exercise @relation(fields: [exerciseId], references: [id])
}
    */
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

export default question;
