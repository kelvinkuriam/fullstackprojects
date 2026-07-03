const {db} = require('../config/database');

function getAllTasks(){
    const stmt = db.prepare('SELECT id,DataTransferItemList,is_completed,created_at FROM tasks ORDER BY created_at DESC');
    return stmt.all();
}

function getTaskById(id){
const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
return stmt.get(id);

}

function createTask(title){
    const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
    const result = stmt.run(title);
    return getTaskById(result.lastInsertRowid);
}
function updateTask(id, isCompleted) {
  const stmt = db.prepare(
    `UPDATE tasks
     SET is_completed = ?,
         updated_at   = datetime('now')
     WHERE id = ?`
  );
  const result = stmt.run(isCompleted ? 1 : 0, id);
  // isCompleted ? 1 : 0 converts JS boolean to SQLite integer
  if (result.changes === 0) return null; // Task not found
  return getTaskById(id);
}
function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0; // true if deleted, false if not found
}
module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask }

