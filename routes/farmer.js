const express = require("express");
const router = express.Router();

const farmerController = require("../controllers/farmer");

router.route("/add").post(farmerController.add_farmer);

router.route("/get/:ticket_id").get(farmerController.get_farmer);

module.exports = router;
