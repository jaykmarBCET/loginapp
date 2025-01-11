import React, { useState } from 'react';
import { updateTodo } from '../api/user.routes';

function UpdateTodo({ index, setUpdate,setObj,obj }) {
  const [todo, setTodo] = useState({ title: "", startTime: "", endTime: "" });

  const handleUpdate = async () => {
    try {
      const response = await updateTodo({
        index,
        title: todo.title,
        startTime: todo.startTime,
        endTime: todo.endTime
      });
      if (response.data.status === 200) {
        setObj( todo)
        setUpdate(false);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="bg-[#fffa] text-black rounded-xl px-4 py-4 border border-[#ffff6692] shadow-2xl flex flex-col gap-y-1 w-72 items-center">
      <div className="flex flex-col items-center">
        <label className="font-sans text-sm font-semibold mb-1">Enter Todo Title:</label>
        <input
          className="py-1 w-40 text-center outline-none px-3 border border-gray-300 rounded-md"
          
          type="text"
          placeholder={obj.title}
          
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-sans text-sm font-semibold mb-1">Enter Start Date:</label>
        <input
          className="py-1 w-40 text-center outline-none border border-gray-300 rounded-md"
          type="date"
          onChange={(e) => setTodo({ ...todo, startTime: e.target.value })}
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-sans text-sm font-semibold mb-1">Enter End Date:</label>
        <input
          className="py-1 w-40 text-center outline-none border border-gray-300 rounded-md"
          type="date"
          
          onChange={(e) => setTodo({ ...todo, endTime: e.target.value })}
        />
      </div>
      <div className="flex gap-3 items-center">
        <button
          className="bg-green-500 hover:bg-green-600 rounded-md px-4 py-2 mt-5 text-white"
          onClick={handleUpdate}
        >
          Update Todo
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 rounded-md px-2 py-2 mt-5 text-white"
          onClick={() => setUpdate(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateTodo;
