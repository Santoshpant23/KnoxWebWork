import { PrismaClient } from "@prisma/client";
import { Router } from "express";

// Instantiate the client
const prisma = new PrismaClient();

const exercise = Router();

exercise.get("/", (req, res) => {
  res.send("Welcome to exercise endpoint");
});

export default exercise;
