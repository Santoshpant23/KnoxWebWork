import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { TokenProvider } from "./components/TokenContext";
import Profile from "./components/Profile";
import AddNewCourse from "./components/AddNewCourse";
import EditCourse from "./components/EditCourse";
import EditExercises from "./components/EditExercises";
import Course from "./components/Students/Course";
import StudentLogin from "./components/Students/StudentLogin";
import SolveExercise from "./components/Students/Exercise";
import SolveQuestion from "./components/Students/SolveQuestion";

function App() {
  return (
    <TokenProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-new-course" element={<AddNewCourse />} />
          <Route path="/edit-course" element={<EditCourse />} />
          <Route path="/edit-exercise" element={<EditExercises />} />
          <Route path="/course/*" element={<Course />} />
          <Route path="/student/login/" element={<StudentLogin />} />
          <Route path="/solve-exercise" element={<SolveExercise/>} />
          <Route path="/solve-question" element={<SolveQuestion/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TokenProvider>
  );
}

export default App;
