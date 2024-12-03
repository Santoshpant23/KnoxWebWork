
const NavBar = () => {
    return (
        <div className="bg-blue-900 flex justify-between">
            <div className="p-5 text-white font-bold bg-blue-800 ">
                <p className="ml-5 mr-10 cursor-pointer">WebWork</p>
            </div>
            <div>
               <p className="text-white text-xs mr-5 p-1">
               Not logged in
               </p>
            </div>
        </div>
    );
}

export default NavBar;
