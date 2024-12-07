import { useEffect, useState } from "react";
import { useToken } from "./TokenContext";
import { useLocation, useNavigate } from "react-router-dom";

interface CourseProps {
  id: number;
  name: string;
  ownedBy: string;
  students: { id: number; name: string }[];
  term: string;
  exercises: { id: number; name: string }[];
}

export default function CoursePage() {
  const { token } = useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [addstudent, setaddstudent] = useState(false);
  const [addexercise, setaddexercise] = useState(false);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [exName, setExName] = useState("");
  const [datePosted, setdatePosted] = useState<Date | null>(null);
  const [dateExpires, setdateExpires] = useState<Date | null>(null);
  

  /*
    model Exercise {
  id          Int        @id @default(autoincrement())
  name        String     @unique
  datePosted  DateTime
  dateExpires DateTime
  questions   Question[]
  courseId    Int
  course      Course     @relation(fields: [courseId], references: [id])
}
  */

  const course: CourseProps = location.state?.course;

  const courseId = course.id;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(()=>{
    console.log(course);
    
  }, [])

 async function addStudent(){
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
            setaddstudent(false);
            navigate("/profile")
        } else{
            alert(data.message)
        }
    } catch(e:any){
        alert("Something went wrong, try again please")
    }
}

async function addExercise(){
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
        setdatePosted(null);
        setdateExpires(null);
        setaddexercise(false);
        navigate("/profile")
    } else{
        alert(data.message)
    }
}

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center p-6">
      <div className="bg-gray-700 text-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{course?.name}</h2>
        <p className="text-sm">
          <strong>Term:</strong> {course?.term || "N/A"}
        </p>
      </div>

      <div className="mt-8 w-full max-w-lg">
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Students</h3>
          {course?.students?.length > 0 ? (
            <ul className="bg-white shadow-sm rounded-lg p-4 space-y-2">
              {course.students.map((student) => (
                <li
                  key={student.id}
                  className="bg-slate-200 p-2 rounded-md flex justify-between"
                >
                  {student.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No students are enrolled in this course.</p>
          )}
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Exercises</h3>
          {course?.exercises?.length > 0 ? (
            <ul className="bg-white shadow-sm rounded-lg p-4 space-y-2">
              {course.exercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className="bg-slate-200 p-2 rounded-md flex justify-between"
                >
                  {exercise.name}
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded shadow"
          aria-label="Add Student"
          onClick={()=> setaddstudent((st)=> st=!st)}
        >
         {addstudent? "Cancel" : "Add Student"}
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded shadow"
          aria-label="Add Exercise"
          onClick={()=> setaddexercise((st)=> st=!st)}
        >
          {addexercise ? "Cancel" : "Add Exercise"}
        </button>
      </div>
      <div className=" mt-5 w-1/2">
        {addstudent && (
            <div className="flex flex-col align-middle justify-center">
                <input className="p-2 m-1 rounded-lg " type="text" name="" id="" placeholder="Student Name" value={name} onChange={(e)=> setName(e.target.value)}/>
                <input className="p-2 m-1 rounded-lg " type="text" name="" id="" placeholder="Username/ID" value={username} onChange={(e)=> setUserName(e.target.value)}/>
                <input className="p-2 m-1 rounded-lg " type="text" name="" id="" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <button className="bg-green-600 p-1 m-1 rounded-xl text-white font-semibold hover:bg-green-700" onClick={addStudent}>Add</button>
            </div>
        )}
      </div>
      <div className=" mt-5">
        {addexercise && (
            <div className="flex flex-col align-middle justify-center">
                <div className="flex align-middle justify-start"><p className="p-2 m-1">Name of the Exercise:</p> <input className="p-2 m-1 rounded-lg " type="text" name="" id="" value={exName} onChange={(e)=>{
                    setExName(e.target.value);
                }}/>  </div>
               <div className="flex align-middle justify-start"><p className="p-2 m-1"> When to post for students? </p><input className="p-2 m-1 rounded-lg " type="date" name="" id="" value={datePosted ? datePosted.toISOString().split('T')[0] : ''} onChange={(e) => setdatePosted(e.target.value ? new Date(e.target.value) : null)} />  </div>
             <div className="flex align-middle justify-start"> <p className="p-2 m-1">   When is the due date/expiry date? </p><input className="p-2 m-1 rounded-lg " type="date" name="" id="" value={dateExpires ? dateExpires.toISOString().split('T')[0] : ''} onChange={(e) => setdateExpires(e.target.value ? new Date(e.target.value) : null)}  />  </div>
             <button className="bg-green-600 p-1 m-1 rounded-xl text-white font-semibold hover:bg-green-700" onClick={addExercise}>Add</button>
            </div>
        )}
      </div>
    </div>
  );
}
