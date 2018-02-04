//Ver.002 DP
const express = require("express");
const router = express.Router();
const tasks = require("../controllers/tasks");
const { catchErrors } = require("../helpers/errorHandlers");

router.get("/all/:status/:capa", tasks.getTasks);
router.get("/project/:id", tasks.getProjectTaskList);
router
  .route("/:id")
  .get(tasks.getTaskById)
  .delete(tasks.deleteTask);
router.put("/:id", catchErrors(tasks.updateTask));
router.post("/export", tasks.dumpTasks);
router.post("/", catchErrors(tasks.createTask));

module.exports = router;
