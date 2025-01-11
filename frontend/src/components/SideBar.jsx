import { useState } from 'react'

function SideBar() {
    return (
        <div className='text-white'>
            <SideBarBtn/>
        </div>
    )
}


function SideBarBtn({ btnName, btnclass, parentClass }) {
    const [flag, setFlag] = useState(false)
    return (
        <div className={parentClass}>
            <h1 className={`text-xl cursor-pointer font-bold ${!flag && "text-blue-500 hover:scale-125 ease-in-out  bg-black rounded-full transition-all  duration-500 py-4 mt-3 px-5"} ${flag && " bg-blue-500 inline-block px-4 mt-5 rounded py-2 hover:bg-blue-600"}`} onClick={() => setFlag(!flag)}>{flag ? "Close" : "|||"}</h1>
            {
                flag ? (
                 (
            <>
                <div className='w-80 flex flex-col'>
                    {
                        btnName.map(ele => {
                            return (<li key={ele} className={btnclass}>{ele}</li>)
                        })
                    }

                </div>
            </>
            )
            ):""
           }
        </div>
    )
}
export default SideBar