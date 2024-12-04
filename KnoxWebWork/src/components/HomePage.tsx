import { Link } from "react-router-dom";

export default function(){
    return(
        <div className="mt-5 p-2">
           <div>
           <p className="text-2xl font-semibold">WebWork</p>
           <p className="mt-1">Welcome to WebWork!</p>
           </div>

           <div className="mt-5 text-blue-500">
            <Link to="/signup">Course Administration</Link>
           </div>

           <div className="mt-5">
            <div className="text-2xl font-semibold">
                Courses
            </div>

            <div className="p-2 m-1">
                <ul className="w-2/3">
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    <li className=" p-2 bg-slate-300 text-blue-900 hover:bg-blue-800 hover:text-white cursor-pointer m-2"><a href="/" className=" font-bold">Fall2024-Math123-1</a></li>
                    
                </ul>
            </div>
           </div>
        </div>
    )
}
