"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moodController_1 = require("../controllers/moodController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.protect, moodController_1.addMood);
router.get('/', authMiddleware_1.protect, moodController_1.getMoods);
exports.default = router;
//# sourceMappingURL=moodRoutes.js.map