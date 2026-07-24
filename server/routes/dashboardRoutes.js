const express = require("express");
const controller = require("../controllers/dashboardController");

const router = express.Router();

router.get("/dashboard", controller.dashboard);
router.get("/summary", controller.summary);
router.get("/banks", controller.banks);
router.get("/chart", controller.chart);
router.get("/report", controller.report);
router.get("/export", controller.exportReport);

module.exports = router;
