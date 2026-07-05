// server/controllers/taskController.js  --  Request handlers.
// Each function: reads req, calls the model, sends res.
// No SQL here. No HTML here. Business logic only.
const { getAllTasks, getTaskById, createTask,
        updateTask, deleteTask } = require("../models/taskModel");
// nn GET /api/tasks  --  Retrieve all tasks nnnnnnnnnnnnnnnnnnnnnnn
function getTasks(req, res) {
  try {
    const tasks = getAllTasks();
    // getAllTasks() is synchronous (better-sqlite3) -- no await needed.
    res.status(200).json({ tasks });
    // res.json() serialises the object to JSON and sets Content-Type header.
    // { tasks } is shorthand for { tasks: tasks }.
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ error: 'Failed to retrieve tasks.' });
  }
}
// nn POST /api/tasks  --  Create a new task nnnnnnnnnnnnnnnnnnnnnnn
function addTask(req, res) {
  try {
    const { title } = req.body;
    // req.body.title is already trimmed and validated by middleware.
    const newTask = createTask(title);
    res.status(201).json({ task: newTask });
    // 201 Created -- the standard code for a successful resource creation.
  } catch (err) {
    console.error('addTask error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
}
// nn PUT /api/tasks/:id  --  Update a task's completion status nnnn
function editTask(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    // req.params.id comes from the URL: PUT /api/tasks/5 -> id = '5'
    // parseInt(..., 10) converts the string '5' to the number 5.
    // The second argument 10 specifies base-10 (decimal). Always include it.
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Task ID must be a number.' });
    }
    const { is_completed } = req.body;
    const updatedTask = updateTask(id, is_completed);
    if (!updatedTask) {
      // updateTask returns null when no row was found with that id
      return res.status(404).json({ error: `Task with id ${id} not found.` });
    }
    res.status(200).json({ task: updatedTask });
  } catch (err) {
    console.error('editTask error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
}
// nn DELETE /api/tasks/:id  --  Delete a task nnnnnnnnnnnnnnnnnnnnn
function removeTask(req, res) {
  try {
    const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
      return res.status(400).json({ error: 'Task ID must be a number.' });
    }
    const deleted = deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: `Task with id ${id} not found.` });
    }
    res.status(204).send();
    // 204 No Content -- success, but nothing to return.
    // .send() with no argument sends an empty body.
  } catch (err) {
    console.error('removeTask error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
}
module.exports = { getTasks, addTask, editTask, removeTask }