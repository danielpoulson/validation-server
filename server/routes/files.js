//Portable
const express = require('express');
const router = express.Router();
const files = require('../controllers/files');
const multer = require('multer');
const config = require('../config/config.js'); 
const uploaded = config.uploaded;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploaded);
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  }	
});

const upload = multer({ storage: storage });

router.get('/:files', files.getFiles);
router.put('/booked/:id', files.updateFileBook);
router.get('/upload/:file', files.downloadFile);
router.post('/upload', upload.any(), files.uploadFile);
router.delete('/delete/:id', files.deletefile);

module.exports = router;