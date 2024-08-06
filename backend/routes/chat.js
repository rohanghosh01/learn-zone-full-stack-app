const express = require("express");
const router = express.Router();
const chatController = require("../controllers/user/chat.controller");
const tokenMiddleware = require("../middlewares/token.middleware");

// Define routes with token middleware where needed
router.post("/chat", tokenMiddleware, chatController.create);
router.post("/group", tokenMiddleware, chatController.createGroup);
router.put("/group", tokenMiddleware, chatController.updateGroup);
router.put(
  "/group/leave/:connectionId",
  tokenMiddleware,
  chatController.leaveGroup
);
router.put(
  "/group/delete/:connectionId",
  tokenMiddleware,
  chatController.deleteGroup
);
router.get("/chats/:connectionId", tokenMiddleware, chatController.list);
router.get("/chat/messages", tokenMiddleware, chatController.myMessages);

module.exports = router;
