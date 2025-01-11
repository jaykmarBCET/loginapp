import Todo from './Todo'
import { AppContext } from '../context/AppProvider'

import { useContext } from 'react'
import { logout } from '../api/user.routes'
import Whiteboard from './Whiteboard'

function Dashboard() {
    const { user } = useContext(AppContext)
    const handleLogout = async () => {
        try {
            const conform = window.confirm('Are you sure you want to logout?')
            if (conform) {
                await logout()
                window.location.reload()
            }


        }
        catch (error) {
            console.error(error)
        }

    }
    const EditHandler = () => {
        window.location.href = '/edit-profile'
    }
    return (
        <>
            <div  className=' w-[95vw]  mt-20  text-white'>
                <button onClick={() => handleLogout()} className=' absolute px-6 py-2  z-50 bg-blue-500 rounded-md hover:scale-125 transition-all duration-400 ease-out hover:rotate-6 hover:bg-blue-600 top-8 right-8'>Logout</button>
                <button onClick={() => EditHandler()} className=' absolute px-6 py-2 z-50  bg-blue-500 rounded-md hover:scale-125 transition-all duration-400 ease-out hover:rotate-6 hover:bg-blue-600 top-8 right-40'>Edit Info</button>

                <h1 className='text-2xl text-center '>Dashboard</h1>
                <div  className=' relative  flex flex-col justify-center gap-2  items-center mt-20'>
                    <img className=' rounded-lg absolute mt-14  h-96 w-[96%]' src={user.coverImage} alt="coverImage" />
                  <div className='z-40 w-full h-full'>
                  <img className='rounded-full relative top-44 left-0 border-8 border-black  z-40   w-40 h-40' src={user.avatar} alt="avatar" />
                  </div>

                    <h1 className='z-10 bg-[#eee7] text-black rounded-xl px-4 py-1 font-semibold text-xl'>{user.name} </h1>
                </div>
                <div className="card min-w-96 z-50 w-[92vw] mx-auto  justify-center items-center flex flex-wrap gap-5 mt-40  h-20">

                <Todo />
                <h1 className='bg-[#eee2] px-10 py-4 text-2xl font-bold rounded-xl'>Whiteboard </h1>
                <Whiteboard/>
                </div>
            </div>
        </>
    )
}

export default Dashboard