import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "./TokenContext";

interface CourseProps {
  id: number;
  name: string;
  ownedBy: string;
  students: { id: number; name: string }[];
  term: string;
  exercises: { id: number; title: string }[];
}

export default function Courses() {

  const { token, studentToken } = useToken();
 
  const [courses, setCourses] = useState<CourseProps[] | null>(null);
  const [loading, setLoading] = useState(true); // To handle the loading state

  useEffect(() => {
    fetchCourses();
  }, []);

  const navigate  = useNavigate();

  async function fetchCourses() {
    try {
      const response = await fetch("http://localhost:3003/course/allcourses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourses(data.courses);
      } else {
        setCourses(null);
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses(null);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  }

  function handleClick(course: CourseProps){
    if(studentToken){
      navigate(`/course/${course.name}-${course.term}`, {
        state: { courseId: course.id }
      });
    } else{
      navigate("/student/login", {state: {courseId: course.id, name: course.name, term: course.term}});
    }
  }

  return (
    <div className="mt-5 p-2">
      <div>
        <p className="text-2xl font-semibold">WebWork</p>
        <p className="mt-1">Welcome to WebWork!</p>
      </div>

      {!token && (
        <div className="mt-5 text-blue-500">
          <Link to="/signup">Course Administration</Link>
        </div>
      )}

      <div className="mt-5">
        <div className="text-2xl font-semibold">Courses</div>

        <div className="p-2 m-1">
          {loading ? (
            <p>Loading courses...</p>
          ) : courses && courses.length > 0 ? (
            <ul className="w-2/3">
              {courses.map((course: CourseProps, index: number) => (
                <li
                  key={index}
                  className="p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"
                >
                 <p
        className="font-bold" onClick={() => handleClick(course)}
      >
                    {course.name+"-"+course.term}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>
    </div>
  );
}
