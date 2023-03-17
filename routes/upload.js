const express = require("express");
const router = express.Router();
const upload = require('../controllers/upload')
router.route("/").post(
  // verifyRoles(ROLES_LIST.admin, ROLES_LIST.teacher),
  upload.update
);

module.exports = router;
