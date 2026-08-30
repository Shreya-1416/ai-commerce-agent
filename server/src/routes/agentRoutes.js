const express = require("express");

const {
  runAgent,
} = require("../controllers/AgentController");

const router = express.Router();

router.post("/chat", runAgent);

module.exports = router;