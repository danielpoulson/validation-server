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
router.post("/projecttasklist/:id", tasks.dumpProjectsTaskList);
router.post("/", catchErrors(tasks.createTask));
router.post("/trello", tasks.createTrello);
router.put("/trello/:id", tasks.editTrello);
router.delete("/trello/:id", tasks.deleteTrello);
router.post("/test", tasks.test);

module.exports = router;
