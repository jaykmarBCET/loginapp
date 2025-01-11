import { asyncHandler } from '../util/asyncHandler.js';
import { ApiError } from '../util/ApiError.js';
import { ApiResponse } from '../util/ApiResponse.js';
import { Todo } from '../model/todolist.model.js';

const addList = asyncHandler(async (req, res) => {
  const { title, startTime, endTime } = req.body;

  // Validate required fields
  if ([title, startTime, endTime].some((field) => field === undefined || field === '')) {
    throw new ApiError(401, 'All fields are required');
  }

  const user = req.user;
  if (!user?._id) {
    throw new ApiError(404, 'User not found');
  }

  const findUser = await Todo.findOne({ userId: user._id });
  const workItem = { title, startTime, endTime };

  if (!findUser) {
    // Create a new Todo entry if user has no existing tasks
    const newTodo = new Todo({
      userId: user._id,
      work: [workItem],
    });

    const result = await newTodo.save();

    if (!result) {
      throw new ApiError(500, 'Error when inserting your work');
    }
  } else {
    // Add the new work item to the existing Todo entry
    findUser.work.push(workItem);
    await findUser.save();
  }

  const result = await Todo.findOne({ userId: user._id });
  if (!result) {
    throw new ApiError(500, 'Error when fetching your work');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Your list was added successfully'));
});

const getTodo = asyncHandler(async (req, res) => {
  const user = String(req.user._id);
  
  const todos = await Todo.findOne({ userId: user});
  

  if (!todos) {
    throw new ApiError(404, 'Todo list not found');
  }

  return res.json(new ApiResponse(200, todos, 'Your list was fetched successfully'));
});

const deleteList = asyncHandler(async (req, res) => {
  const { index } = req.body;
  const user = req.user;

  if (!user) {
      throw new ApiError(401, 'User not authorized');
  }

  const findUser = await Todo.findOne({ userId: user._id });
  if (!findUser) {
      throw new ApiError(404, 'User not found');
  }

  const len = findUser.work.length;
  if (index < 0 || index >= len) {
      throw new ApiError(400, 'Invalid index');
  }

  // Remove the specific item at the given index
  findUser.work.splice(index, 1);
  await findUser.save();

  return res
      .status(200)
      .json(new ApiResponse(200, findUser, 'Your list was deleted successfully'));
});

const updateList = asyncHandler(async (req, res) => {
  const { index, title, startTime, endTime } = req.body;
  console.log(req.body);

  if (index === undefined || title === undefined || startTime === undefined || endTime === undefined) {
    throw new ApiError(400, 'Please fill all the fields');
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const findUser = await Todo.findOne({ userId: user._id });

  if (!findUser) {
    throw new ApiError(404, 'User not found');
  }

  if (index < 0 || index >= findUser.work.length) {
    throw new ApiError(404, 'Invalid index');
  }

  findUser.work[index] = { title, startTime, endTime };
  await findUser.save();

  return res.status(200).json(new ApiResponse(200, findUser.work[index], 'Your data was updated successfully'));
});

export { addList,deleteList,getTodo,updateList}
