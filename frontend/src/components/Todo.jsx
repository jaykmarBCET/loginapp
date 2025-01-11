import  {  useEffect, useState } from 'react';
import Card from './Card';
import { toast } from 'react-toastify';

import { getTodoList ,addTodo} from '../api/user.routes';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', startTime: '', endTime: '' });
  todos.sort((a,b)=>a.startTime.localeCompare(b.startTime))
  const addList = () => {
    if (newTodo.title && newTodo.startTime && newTodo.endTime) {
      try {

       const response =  addTodo(newTodo);
       if(response){
         toast.success("Work added")
       }
        setTodos([...todos, newTodo]);
        
        setNewTodo({ title: '', startTime: '', endTime: '' });
      } catch (error) {
        console.log("Something have error while we add todos",error.message);
        toast.error("work faild for add")
      }
      
    }else{
       toast.info("Please field all field")
    }
  };

  const fetchData = async()=>{
    const response = await getTodoList()
    setTodos(response.data.work)
  }

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div className="bg-blue-300 w-[95vw] rounded-lg px-6 py-2 min-h-56 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-mono py-3">Your Todo List</h1>
      <button onClick={()=>fetchData()}>Fetch work</button>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <div className="flex flex-col">
          <label>Enter your work name</label>
          <input required={true}
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="outline-none px-6 py-2 text-black"
            type="text"
            placeholder="Enter your work name"
          />
        </div>
        <div className="flex flex-col">
          <label>Start Time</label>
          <input required={true}
            value={newTodo.startTime}
            onChange={(e) => setNewTodo({ ...newTodo, startTime: e.target.value })}
            className="text-black outline-none px-6 py-2"
            type="date"
          />
        </div>
        <div className="flex flex-col">
          <label>End Time</label>
          <input required={true}
            value={newTodo.endTime}
            onChange={(e) => setNewTodo({ ...newTodo, endTime: e.target.value })}
            className="text-black outline-none px-6 py-2"
            type="date"
          />
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={addList}
            className="px-8 rounded-md hover:bg-green-500 bg-black py-2 text-white transition duration-300 ease-in-out"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap mt-10 bg-[#eee4] rounded-lg shadow-lg px-6 py-3 justify-center items-center">
        {todos && todos.length > 0 ? (
          todos.map((todo, index) => (
            <Card key={index}  index={index} title={todo.title} start={todo.startTime} end={todo.endTime} todos={todos} setTodos={setTodos}  />
          ))
        ) : (
          <p>No todos available</p>
        )}
      </div>
    </div>
  );
}

export default Todo;
