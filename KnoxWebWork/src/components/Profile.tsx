import React, { useEffect, useState } from "react";
import { useToken } from "./TokenContext";
import { useNavigate } from "react-router-dom";

interface CourseProps {
  name: string;
  ownedBy: string;
  students: { id: number; name: string }[];
  term: string;
  exercises: { id: number; title: string }[];
}

interface ProfileProps {
  name: string;
  email: string;
}

export default function CoursePage() {
  const { token } = useToken();
  const navigate = useNavigate();

  // console.log("I am inside profile and my current token is  " + token);
  

  const [courses, setCourses] = useState<CourseProps[] | null>(null);
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingC, setLoadingC] = useState(true);

  // Redirect unauthorized users
  useEffect(() => {
    if (!token) {
      alert("Unauthorized Access");
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch profile and courses
  useEffect(() => {
    fetchProfile();
    fetchCourses();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch("http://localhost:3003/admin/details", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.details);
      } else {
        alert("Error fetching profile: " + data.message);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoadingP(false);
    }
  }

  async function fetchCourses() {
    try {
      const response = await fetch("http://localhost:3003/course/mycourses", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setCourses(data.courses);
      } else {
        alert("Error fetching courses: " + data.message);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoadingC(false);
    }
  }

  function gotoCourse(course: CourseProps){
    navigate("/edit-course", { state: { course } });
  }

  function EachCourse({ course }: { course: CourseProps }) {
    const coursename = course.name;
    const term = course.term;
    const totalExercises = course.exercises?.length || 0;
    const totalStudents = course.students?.length || 0;
  
    return (
      <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white cursor-pointer hover:bg-slate-100" onClick={()=>{
        gotoCourse(course);
      }} >
        <h3 className="text-lg font-semibold text-blue-600">{coursename}</h3>
        <ul className="mt-2 text-gray-600 space-y-1">
          <li>
            <span className="font-medium">Term:</span> {term}
          </li>
          <li>
            <span className="font-medium">Total Exercises:</span> {totalExercises}
          </li>
          <li>
            <span className="font-medium">Students Registered:</span> {totalStudents}
          </li>
        </ul>
      </div>
    );
  }
  

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Profile Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Profile:</h2>
          {loadingP ? (
            <div className="text-gray-500">Loading Profile...</div>
          ) : profile ? (
            <ul className="space-y-2">
              <li>
                <span className="font-medium text-gray-700">Name:</span> {profile.name}
              </li>
              <li>
                <span className="font-medium text-gray-700">Email:</span> {profile.email}
              </li>
            </ul>
          ) : (
            <div className="text-red-500">Profile data unavailable.</div>
          )}
        </div>

        {/* Courses Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
            My Courses:
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200"
              onClick={() => navigate("/add-new-course")}
            >
              <span className="mr-2 text-lg font-bold">+</span> Add a Course
            </button>
          </h2>
          <div>
            {loadingC ? (
              <div className="text-gray-500">Loading Courses...</div>
            ) : courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses &&
                  courses.map((course, index) => (
                    <EachCourse key={index} course={course} />
                  ))}
              </div>
            ) : (
              <div className="text-gray-600">No Courses Found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
