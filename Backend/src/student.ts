import { Router } from "express";
import { PrismaClient } from "@prisma/client";

// Instantiate the client
const prisma = new PrismaClient();

const student = Router();

student.get("/", (req, res) => {
  res.send("Welcome to student endpoint");
});

export default student;
