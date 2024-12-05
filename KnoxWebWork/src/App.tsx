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

        </Routes>
        <Footer />
      </BrowserRouter>
    </TokenProvider>
  );
}

export default App;
