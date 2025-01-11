import {  useState } from 'react';
// import { AppContext } from '../context/AppProvider';
import { FaSpinner } from "react-icons/fa";
import { changeAvatar, changeName, changeCoverImage } from '../api/user.routes';
import {toast} from 'react-toastify'



function ModelEdit({  name,setDataName }) {
  const [inputData, setInputData] = useState("")
  const [loading, setLoading] = useState(false)

  const handelSumit = async (e) => {
    if(!inputData){
      return toast.info("All field required")
    }
    e.preventDefault()
    try {
      if (name === 'avatar') {
        const formData = new FormData()
        formData.append('avatar', inputData)
        
        setLoading(true)
        toast.info("Pending please wait for update")
        const response = await changeAvatar(formData)
        
          toast.success("Your avatar image changed")
        
        console.log(response);
        setLoading(false)
        console.log(response.data);
      }
      else if (name === 'coverImage') {
        const formData = new FormData()
        formData.append('coverImage', inputData)
        setLoading(true)
        toast.info("Pending please wait for update")
        const response = await changeCoverImage(formData)
        setLoading(false)
        
          toast.success("Changed")
   
      }
      else {
        
        
        setLoading(true)
        const response = await changeName({name:inputData})
        setLoading(false)
       
          toast.success("your name is changed")
        

      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong")
    }
    finally{
      setLoading(false)
    }

  }

  if (name === 'avatar') {
    return (
      <>

        <div style={{ zIndex: "100" }} className="card absolute flex flex-col w-screen h-screen bg-opacity-70 justify-center items-center bg-black top-0">
          <form className="bg-white flex flex-col gap-4 px-8 py-10 rounded-xl" onSubmit={() => false}>
           <p onClick={()=>setDataName("")} className='text-black px-4 py-2 bg-red-500 rounded-lg text-center cursor-pointer'>Close</p>
            <div className="card-body">
              <label >
                <p className="px-4 py-2 bg-blue-500 cursor-pointer rounded-xl mb-4 inline-block">Upolad File </p>
                <input type="file" onClick={(e) => setInputData(e.target.files[0])} required />
              </label>
            </div>
            <button onClick={handelSumit} className="btn bg-black px-4  py-2 rounded-lg">{!loading?"Change": <FaSpinner className=' animate-spin  transition-all text-2xl' />}</button>
          </form>
        </div>
      </>
    )
  }
  else if (name === 'coverImage') {
    return (
      <>

        <div style={{ zIndex: "100" }} className="card absolute flex flex-col w-screen h-screen bg-opacity-70 justify-center items-center bg-black top-0">
          <form className="bg-white flex flex-col gap-4 px-8 py-10 rounded-xl" onSubmit={() => false} required>
          <p onClick={()=>setDataName("")} className='text-black px-4 py-2 bg-red-500 rounded-lg text-center cursor-pointer'>Close</p>
            <div className="card-body">
              <label >
                <p className="px-4 py-2 bg-blue-500 rounded-xl mb-4 inline-block">Upolad File </p>
                <input onChange={(e)=>setInputData(e.target.files[0])} type="file" required />
              </label>
            </div>
            <button onClick={handelSumit} className="btn bg-black px-4 py-2 rounded-lg">{!loading?"Change": <FaSpinner className=' animate-spin  transition-all text-2xl' />}</button>
          </form>
        </div>
      </>
    )
  }
  else {
    return (
      <>

        <div style={{ zIndex: "100" }} className="card absolute flex flex-col mx-auto w-screen h-screen bg-opacity-70 justify-center items-center bg-black top-0">
          <form className="bg-white flex-col  justify-center items-center gap-4 flex px-8 py-10 rounded-xl" onSubmit={() => false}>
           <p onClick={()=>setDataName("")} className='text-black px-4 py-2 bg-red-500 rounded-lg text-center cursor-pointer'>Close</p>
            <div className="card-body">
              
              <input onChange={(e)=>setInputData(e.target.value)} type="text" className='px-4 py-2 outline-none text-black' name='name' placeholder='Enter name' required />
            </div>
            <button onClick={handelSumit} className={`btn bg-black px-4 py-2 rounded-lg `}>{!loading?"Change": <FaSpinner className=' animate-spin  transition-all text-2xl' />}</button>
          </form>
        </div>
      </>
    )
  }

}

export default ModelEdit;
