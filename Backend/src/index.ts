import express from "express";
import student from "./student";
import course from "./course";
import exercise from "./exercises";
import question from "./questions";
import owners from "./owners";

const app = express();

app.use(express.json());

const port = 3003;

app.use("/student", student);

app.use("/course", course);

app.use("/exercise", exercise);

app.use("/question", question);

app.use("/admin", owners);

app.get("/", (req: any, res: any) => {
  return res.send("Healthy Server");
});

app.listen(port, () => {
  console.log("Healthy");
});
