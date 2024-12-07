import { useEffect, useState } from "react";
import { useToken } from "./TokenContext";
import { useLocation, useNavigate } from "react-router-dom";

interface CourseProps {
  id: number;
  name: string;
  ownedBy: string;
  students: Student[];
  term: string;
  exercises: { id: number; name: string }[];
}

interface Student{
    id: number;
    name: string;
    username: string;
    password: string;
}

export default function CoursePage() {
  const { token } = useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [addStudent, setAddStudent] = useState(false);
  const [addExercise, setAddExercise] = useState(false);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [exName, setExName] = useState("");
  const [datePosted, setDatePosted] = useState<Date | null>(null);
  const [dateExpires, setDateExpires] = useState<Date | null>(null);
  const [editstudent, setEditStudent] = useState<boolean>(false);
  const [currstudent, setCurrentStudent] = useState<Student | null>(null);

  const course: CourseProps = location.state?.course;
  const courseId = course.id;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    console.log(course);
  }, [course]);

  async function addStudentHandler() {
    try{
        const response = await fetch("http://localhost:3003/student/add-students", {
            method: "POST",
            headers: {
                "Content-Type":"Application/json"
            },
            body: JSON.stringify({
                token, username, name, password, courseId
            })
        });

        const data = await response.json();
        if(data.success){
            alert("Success");
            setUserName("");
            setPassword("");
            setAddStudent(false);
            navigate("/profile")
        } else{
            alert(data.message)
        }
    } catch(e:any){
        alert("Something went wrong, try again please")
    }
  }

  async function addExerciseHandler() {
    const response = await fetch("http://localhost:3003/exercise/add-exercise", {
        method: "Post",
        headers: {
            "Content-type": "Application/json"
        },
        body: JSON.stringify({
            token, courseId, "name": exName, datePosted, dateExpires
        })

    })
    const data = await response.json();

    if(data.success){
        alert("Success");
        setExName("");
        setDatePosted(null);
        setDateExpires(null);
        setAddExercise(false);
        navigate("/profile")
    } else{
        alert(data.message)
    }
  }

  function handleStudentClick(student: Student) {
    console.log("Student clicked:", student);
    setEditStudent((st)=> st = !st);
    setCurrentStudent(student);
  }

  function handleExerciseClick(exercise: { id: number; name: string }) {
    console.log("Exercise clicked:", exercise);
    // Add logic here
  }

  async function updateStudent(){
    const response = await fetch("http://localhost:3003/student/update-student", {
        method: "Post",
        headers: {
            "Content-type": "Application/json"
        },
        body: JSON.stringify({
           "studentInfo": currstudent, token, courseId
        })
    });

    const data = await response.json();

    if(data.success){
        alert("Success");
        setCurrentStudent(null);
        navigate("/profile");
    } else{
        alert(data.message)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{course?.name}</h2>
        <p className="text-sm">
          <strong>Term:</strong> {course?.term || "N/A"}
        </p>
      </div>

      <div className="mt-8 w-full max-w-lg">
        {/* Students Section */}
        <section className="mb-6">
  <h3 className="text-xl font-semibold mb-2">Students</h3>
  {course?.students?.length > 0 ? (
    <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
      {course.students.map((student: Student) => (
        <li
          key={student.id}
          className="p-4 flex justify-between items-center"
        >
          <span className="font-medium text-gray-800">{student.name}</span>
          <button
            className="text-blue-500 hover:text-blue-600 flex items-center"
            onClick={() => handleStudentClick(student)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487c.37-.37.862-.574 1.387-.574s1.018.204 1.387.574l1.877 1.876c.37.37.574.862.574 1.388s-.204 1.018-.574 1.388L7.83 20.883a4.5 4.5 0 01-1.893 1.105l-4.385 1.27a.75.75 0 01-.928-.928l1.27-4.384a4.5 4.5 0 011.105-1.893L16.862 3.487z"
              />
            </svg>
            Edit
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600">No students are enrolled in this course.</p>
  )}
  <div>
    {editstudent && (
      <div className="flex flex-col mt-1 p-1">
        <input
          className="p-1 mt-1 rounded-lg w-full"
          type="text"
          placeholder="Name"
          value={currstudent?.name}
          onChange={(e) => {
            setCurrentStudent((curr) =>
              curr ? { ...curr, name: e.target.value } : null
            );
          }}
        />
        <input
          className="p-1 mt-1 rounded-lg w-full"
          type="text"
          placeholder="Username/ID"
          value={currstudent?.username}
          onChange={(e) => {
            setCurrentStudent((curr) =>
              curr ? { ...curr, username: e.target.value } : null
            );
          }}
        />
        <input
          className="p-1 mt-1 rounded-lg w-full"
          type="text"
          placeholder="Password"
          value={currstudent?.password}
          onChange={(e) => {
            setCurrentStudent((curr) =>
              curr ? { ...curr, password: e.target.value } : null
            );
          }}
        />
        <button
          className="p-2 mt-2 bg-green-600 rounded-3xl text-white hover:bg-green-700 font-semibold"
          onClick={updateStudent}
        >
          Update
        </button>
      </div>
    )}
  </div>
</section>


        {/* Exercises Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Exercises</h3>
          {course?.exercises?.length > 0 ? (
            <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
              {course.exercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className="p-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <span className="font-medium text-gray-800">{exercise.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No exercises have been added for this course.</p>
          )}
        </section>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          className={`px-4 py-2 font-medium rounded shadow ${
            addStudent
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={() => setAddStudent((prev) => !prev)}
        >
          {addStudent ? "Cancel" : "Add Student"}
        </button>
        <button
          className={`px-4 py-2 font-medium rounded shadow ${
            addExercise
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          onClick={() => setAddExercise((prev) => !prev)}
        >
          {addExercise ? "Cancel" : "Add Exercise"}
        </button>
      </div>

      {/* Add Student Form */}
      {addStudent && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-lg">
          <h4 className="text-lg font-semibold mb-4">Add New Student</h4>
          <div className="space-y-4">
            <input
              className="w-full p-2 border rounded-lg"
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded-lg"
              type="text"
              placeholder="Username/ID"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg"
              onClick={addStudentHandler}
            >
              Add Student
            </button>
          </div>
        </div>
      )}

      {/* Add Exercise Form */}
      {addExercise && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-lg">
          <h4 className="text-lg font-semibold mb-4">Add New Exercise</h4>
          <div className="space-y-4">
            <input
              className="w-full p-2 border rounded-lg"
              type="text"
              placeholder="Exercise Name"
              value={exName}
              onChange={(e) => setExName(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded-lg"
              type="date"
              value={datePosted ? datePosted.toISOString().split("T")[0] : ""}
              onChange={(e) => setDatePosted(e.target.value ? new Date(e.target.value) : null)}
            />
            <input
              className="w-full p-2 border rounded-lg"
              type="date"
              value={dateExpires ? dateExpires.toISOString().split("T")[0] : ""}
              onChange={(e) => setDateExpires(e.target.value ? new Date(e.target.value) : null)}
            />
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg"
              onClick={addExerciseHandler}
            >
              Add Exercise
            </button>
          </div>
        </div>
      )}
     
    </div>
  );
}
