function validateCreateTask(req, res, next) {
  // Destructure title from the request body.
  // req.body is populated by express.json() middleware.
  const { title } = req.body;
  // Check 1: title must be present
  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Task title is required and must be a string.'
       });
    // 'return' stops execution here. Without it, next() below would also run.
  }
  // Check 2: title must not be just whitespace
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Task title cannot be empty or whitespace only.',
    });
  }
  // Check 3: title must not exceed 200 characters
  if (trimmed.length > 200) {
    return res.status(400).json({
      error: 'Validation failed',
      message: `Task title must be 200 characters or fewer. Got ${trimmed.length}.`,
    });
  }
  // Attach the cleaned title to req.body so the controller uses the trimmed version
  req.body.title = trimmed;
  // All checks passed -- pass control to the next middleware or route handler
  next();
}
function validateUpdateTask(req, res, next) {
  const { is_completed } = req.body;
  if (is_completed === undefined || is_completed === null) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'is_completed field is required.',
    });
  }
  if (typeof is_completed !== 'boolean') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'is_completed must be a boolean (true or false).',
    });
  }
  next();
}
module.exports = { validateCreateTask, validateUpdateTask }