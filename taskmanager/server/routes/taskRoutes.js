// server/routes/taskRoutes.js  --  URL routing only.
// Maps HTTP method + path -> middleware -> controller.
// No logic here. Pure routing.
const express = require("express");
const router  = express.Router();
// express.Router() creates a mini Express application.
// It has its own middleware stack and route definitions.
// We mount it onto app with: app.use('/api', router)
// Routes defined here are relative to the mount path.
const { getTasks, addTask, editTask, removeTask } = require("../controllers/taskController");
const { validateCreateTask, validateUpdateTask } = require("../middleware/validateTask");
// GET /api/tasks  --  Return all tasks
// No middleware needed -- reading data has no validation requirements.
router.get('/tasks', getTasks);
// POST /api/tasks  --  Create a new task
// validateCreateTask runs FIRST. If it calls next(), addTask runs.
// If validateCreateTask sends a 400 response, addTask never runs.
router.post('/tasks', validateCreateTask, addTask);
// PUT /api/tasks/:id  --  Update task completion
// :id is a URL parameter -- Express captures it as req.params.id.
router.put('/tasks/:id', validateUpdateTask, editTask);
// DELETE /api/tasks/:id  --  Delete a task
router.delete('/tasks/:id', removeTask)
module.exports = router;
// Route summary:
// GET    /api/tasks        -> getTasks
// POST   /api/tasks        -> validateCreateTask -> addTask
// PUT    /api/tasks/:id    -> validateUpdateTask -> editTask
// DELETE /api/tasks/:id    -> removeTask