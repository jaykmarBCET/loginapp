import { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppProvider';


function Navigation() {
  const [open , setOpen] = useState(false);

  const { user}  = useContext(AppContext);

  const navItems = [
    { name: "Home", path: "/" },
    { name: user.email?user.name:"Login", path: "/login" },
    { name: "Register", path: "/register" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className={`ml-3  fixed left-0 ${open&& "min-w-96 "} float-left pr-1 z-50`}>
      <ButtonForNavigation open={open} setOpen={setOpen} items={navItems} btnClass="bg-blue-500 text-sm py-2 px-3 hover:bg-blue-600 transition-all duration-200 hover:rotate-6 rounded" />   
    </div>
  );
}

function ButtonForNavigation({ btnClass, items ,open,setOpen}) {
 

  return (
    <div className={`px-4 ${open ? " bg-white rounded-xl absolute transition-all ease-in-out duration-300 px-4 py-3 mt-2" : ""}`}>
      <h1 
        className={`text-xl cursor-pointer font-bold ${!open ? "text-blue-500 hover: ease-in-out bg-black rounded-full transition-all duration-500 py-4 mt-3 px-5" : "bg-blue-500 inline-block px-4 mt-5 rounded py-2 hover:bg-blue-600"}`} 
        onClick={() => setOpen(!open)}
        onMouseEnter={()=>setOpen(!open)}
        
      >
        {open ? "Close" : "|||"}
      </h1>
      {open && (
        <div className="flex flex-wrap justify-center items-center list-none gap-2 text-center flag-wrap py-4">
          {items.map(item => (
            <Link key={item.name} to={item.path} className={`${btnClass} ${open ? "shadow shadow-red-300 transition-all font-semibold" : ""}`}>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navigation;