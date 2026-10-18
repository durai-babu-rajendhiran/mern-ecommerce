const express = require("express");
const router = express.Router();

const { chat, getSuggestions, health } = require("../controllers/aiAgent");

// AI Agent routes
router.post("/ai/chat", chat);
router.get("/ai/suggestions", getSuggestions);
router.get("/ai/health", health);

module.exports = router;
