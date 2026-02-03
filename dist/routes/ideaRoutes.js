"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ideaController_1 = require("../controllers/ideaController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.protect, ideaController_1.createIdea);
router.get('/', authMiddleware_1.protect, ideaController_1.listIdeas);
router.put('/:id', authMiddleware_1.protect, ideaController_1.updateIdea);
router.delete('/:id', authMiddleware_1.protect, ideaController_1.deleteIdea);
exports.default = router;
//# sourceMappingURL=ideaRoutes.js.map