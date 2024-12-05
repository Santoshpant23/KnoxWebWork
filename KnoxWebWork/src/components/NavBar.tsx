import { Link, useNavigate } from "react-router-dom";
import { useToken } from "./TokenContext";

const NavBar = () => {

    const {token, setToken} = useToken();

    const navigate = useNavigate();


    function logOut() {
        localStorage.removeItem("token");
        setToken(null);
        console.log("Logged out. Token set to null.");
        navigate("/");
    }
    

    function gotoProfile(){
        navigate("/profile");
    }


    return (
        <div className="bg-blue-900 flex justify-between">
            <div className="p-5 text-white font-bold bg-blue-800 ">
                <Link to={"/"} className="ml-5 mr-10 cursor-pointer">WebWork</Link>
            </div>
            <div>
              {token == null ? (
                <div>
                    <p className="text-white text-xs mr-5 p-1">
                        Not logged in
                    </p>
                </div>
              ) : (
                <div className="text-white mr-5">
                    <button className="bg-slate-600 p-2 mt-2 border-2 border-green-800 rounded-xl hover:bg-slate-700 mr-1" onClick={gotoProfile}>Profile</button>
                    <button className="bg-slate-600 p-2 mt-2 border-2 border-green-800 rounded-xl hover:bg-slate-700" onClick={logOut}>Logout</button>
                </div>
              )}
            </div>
        </div>
    );
}

export default NavBar;
