import { FcEditImage } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
// import ModelEdit from "./ModelEdit";
import { AppContext } from '../context/AppProvider'
import { useContext, useState } from 'react'
import ModelEdit from "./ModelEdit";

function DashboardEdit() {
    const { user } = useContext(AppContext)
    const [flagEditCoverImage, setFlagEditCoverImage] = useState(false)
    const [flagEditName, setFlagEditName] = useState(false)
    const [flagEditAvatar, setFlagEditAvatar] = useState(false)
    const [dataName , setDataName] = useState("")

    return (
        <>
            <div className='w-[95vw] mt-10 flex flex-col text-white relative'>
                <button onClick={() => {
                    window.location.href = "/"
                }} className='absolute px-4 py-2 bg-blue-500 rounded-md hover:scale-110 transition-all duration-300 ease-out hover:rotate-6 hover:bg-blue-600 top-4 right-4 sm:top-8 sm:right-8 text-sm sm:text-base'>GO BACK</button>

                <h1 className='text-xl sm:text-2xl text-center mt-6 sm:mt-10 mb-6 sm:mb-10'>Dashboard</h1>

                <p className={`absolute bottom-40 sm:bottom-48 z-50 right-6 sm:right-10 ml-2 sm:ml-5 bg-gray-600 opacity-0 py-2 rounded-xl text-xs sm:text-sm px-3 sm:px-4 ${flagEditCoverImage && "transition-all duration-300 opacity-100"}`}>
                    Edit cover Image
                </p>
                <FaEdit
                    onMouseEnter={() => setFlagEditCoverImage(true)}
                    onMouseLeave={() => setFlagEditCoverImage(false)}
                    onClick={() => setDataName("coverImage")}
                    className="bottom-20 sm:bottom-24 hover:bg-black right-16 sm:right-20 z-50 border-2 border-black bg-blue-500 p-1 h-8 w-8 sm:h-10 sm:w-10 rounded-full absolute cursor-pointer hover:rotate-12 hover:text-blue-500" />

                <div className='relative flex flex-col justify-center gap-4 sm:gap-6 items-center mt-10 sm:mt-20'>
                    <img className='rounded-lg absolute mt-12 sm:mt-14 h-56 sm:h-96 w-[92%] sm:w-[96%]' src={user.coverImage} alt="coverImage" />
                    <div className="z-40 w-full h-full relative">
                        <p className={`absolute left-6 sm:left-8 -bottom-60 sm:-bottom-72 bg-gray-600 opacity-0 py-2 rounded-xl text-xs sm:text-sm px-3 sm:px-4 ${flagEditAvatar && "transition-all duration-300 opacity-100 z-50"}`}>Edit Avatar</p>
                        <FaEdit
                            onMouseEnter={() => setFlagEditAvatar(true)}
                            onMouseLeave={() => setFlagEditAvatar(false)}
                            onClick={() => setDataName("avatar")}
                            className="z-50 absolute -bottom-72 sm:-bottom-80 left-28 sm:left-36 text-lg sm:text-xl bg-blue-500 p-1 sm:p-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full hover:bg-black cursor-pointer hover:text-blue-500 transition-all duration-300 hover:rotate-12" />
                        <img className='rounded-full absolute z-40 left-2 sm:left-3 border-black border-6 sm:border-8 -bottom-80 sm:-bottom-96 w-32 h-32 sm:w-40 sm:h-40' src={user.avatar} alt="avatar" />
                    </div>
                    <p className={`bg-gray-600 opacity-0 py-2 rounded-xl text-xs sm:text-sm px-3 sm:px-4 ${flagEditName && "transition-all duration-300 opacity-100 z-50"}`}>Edit Name</p>
                    <FaEdit
                        onMouseEnter={() => setFlagEditName(true)}
                        onMouseLeave={() => setFlagEditName(false)}
                        onClick={() => setDataName("name")}
                        className="z-50 text-3xl sm:text-4xl cursor-pointer hover:text-blue-500 transition-all duration-300 hover:rotate-12" />
                    <h1 className='z-10 px-3 py-1 rounded-xl font-semibold text-lg sm:text-xl bg-[#eee7]'>{user.name}</h1>
                </div>

                <div className="card min-w-72 sm:min-w-96 z-50 justify-center items-center flex flex-wrap gap-3 sm:gap-5 mt-20 sm:mt-40 h-16 sm:h-20">
                    {/* Add content or actions here */}
                </div>

                {dataName && <ModelEdit setDataName={setDataName} type={dataName !== 'name' ? "image" : "text"} name={dataName} />}
            </div>
        </>
    )
}

export default DashboardEdit;
