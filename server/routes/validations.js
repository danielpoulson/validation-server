const express = require('express');
const router = express.Router();
const validations = require('../controllers/validations');

router.get('/', validations.getValidations);
router.post('/', validations.createValidation);

router.put('/validationlog/:id', validations.updateValidationComment);
router.put('/validation-vms/:id', validations.updateValidationVms);

router
  .route('/:id')
  .get(validations.getValidationById)
  .put(validations.updateValidation);

router.post('/export', validations.dumpValidations);
// router.get('/userdashboard/:user', validations.getUserDashboard);

module.exports = router;
