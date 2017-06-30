//Ver.002 DP
const express = require('express');
const router = express.Router();
const tasks = require('../controllers/tasks');

router.get('/all/:status/:capa', tasks.getTasks);
router.get('/project/:id', tasks.getProjectTaskList);
router.route('/:id')
    .get(tasks.getTaskById)
    .put(tasks.updateTask)
    .delete(tasks.deleteTask);
router.post('/export', tasks.dumpTasks);
router.post('/', tasks.createTask);

 module.exports = router;