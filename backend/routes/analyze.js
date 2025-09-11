const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { analyze } = require("../controllers/analyzeController");

router.get("/", (req, res) => res.json({ message: "Welcome World" }));
router.post("/", upload.single("file"), analyze);

module.exports = router;
