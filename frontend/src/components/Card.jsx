import UpdateTodo from './UpdateTodo';
import { deleteTodo } from '../api/user.routes';
import { useState } from 'react';


function Card({ title, start, end, index, todos, setTodos }) {
  const [obj , setObj] = useState({ title, start, end });
  const [update,setUpdate] = useState(false)
  const deleteHandler = async () => {
    try {
      await deleteTodo({ index });
      
      const modifiedTodos = todos.filter((todo) => todo.startTime !== start);
      setTodos(modifiedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <>
    {
      update?<UpdateTodo index={index} setUpdate={setUpdate} setObje={setObj} obj={obj} />:(
        <div className="max-w-xs min-h-40 bg-white overflow-hidden px-2 flex flex-col text-black p-4 rounded-lg shadow-lg m-4">
      <h1 className="text-lg font-bold mb-2">{obj.title}</h1>
      <h1 className="mb-2">Start Time: <span className="font-medium">{obj.start}</span></h1>
      <h1 className="mb-4">End Time: <span className="font-medium">{obj.end}</span></h1>

      <div className="flex min-w-56 gap-14 justify-center">
        <button onClick={()=>setUpdate(!update)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out">Update</button>
        <button onClick={deleteHandler} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">Delete</button>
      </div>
      
    </div>
      )
    }
    </>
  );
}

export default Card;
