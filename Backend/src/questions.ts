import { PrismaClient } from "@prisma/client";
import { Router } from "express";

// Instantiate the client
const prisma = new PrismaClient();

const question = Router();

question.get("/", (req, res) => {
  res.send("Welcome to question endpoint");
});

export default question;
