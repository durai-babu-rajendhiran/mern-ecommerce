const express = require("express");
const router = express.Router();
const { authCheck, adminCheck } = require("../middlewares/auth");
const { create, read, update, remove, list } = require("../controllers/sub");

router.post("/sub", authCheck, adminCheck, create);
router.get("/sub", list);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);

module.exports = router;
