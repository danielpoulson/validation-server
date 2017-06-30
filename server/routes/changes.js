const express = require('express');
const router = express.Router();
const changes = require('../controllers/changes');

router.get('/all/:status', changes.getChanges);
router.post('/', changes.createChange);
router.put('/changelog/:id', changes.updateChangeComment);

// TODO: (3) (MAJOR) - Get files and tasks that are associated with a change when download a change
// A change requires the associated tasks and files to be downloaded at the same time however
// currently these are all downloaded with seperate calls. At the application level the state of a change
// should be associated with the task and the files so changes to state are managed together.
router.route('/:id')
    .get(changes.getChangeById)
    .put(changes.updateChange);

router.post('/export', changes.dumpChanges);
router.get('/userdashboard/:user', changes.getUserDashboard);

module.exports = router;