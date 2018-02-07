const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");
const { catchErrors } = require("../helpers/errorHandlers");

router.post("/alltoms", catchErrors(projects.toMsProject));
router.get("/all/:status", projects.getProjects);
router.get("/byValidations/:id", projects.getValProjects);
router.post("/", projects.createProject);
router.put("/projectlog/:id", projects.updateProjectComment);

// TODO: (3) (MAJOR) - Get files and tasks that are associated with a Project when download a Project
// A Project requires the associated tasks and files to be downloaded at the same time however
// currently these are all downloaded with seperate calls. At the application level the state of a Project
// should be associated with the task and the files so projects to state are managed together.
router
  .route("/:id")
  .get(projects.getProjectById)
  .put(projects.updateProject);

router.post("/export", projects.dumpProjects);
router.get("/userdashboard/:user", projects.getUserDashboard);

module.exports = router;
