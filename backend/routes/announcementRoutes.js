const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");

router.get("/", announcementController.getAllAnnouncements);
router.post("/", announcementController.addAnnouncement);
router.delete("/:id", announcementController.deleteAnnouncement);

module.exports = router;