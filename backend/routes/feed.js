const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed/feed.controller");
const feedLikeController = require("../controllers/feed/feedLike.controller");
const feedSaveController = require("../controllers/feed/feedSave.controller");
const feedCommentController = require("../controllers/feed/feedComment.controller");
const tokenMiddleware = require("../middlewares/token.middleware");

// Define routes with token middleware where needed
router.post("/feed", tokenMiddleware, feedController.create);
router.get("/feed/:id", tokenMiddleware, feedController.detail);
router.delete("/feed/:id", tokenMiddleware, feedController.delete);
router.patch("/feed", tokenMiddleware, feedController.update);
router.get("/feeds", tokenMiddleware, feedController.list);
router.post("/feed/:id/like", tokenMiddleware, feedLikeController.likeDislike);
router.post("/feed/:id/save", tokenMiddleware, feedSaveController.saveUnSave);
router.get("/feed/saved", tokenMiddleware, feedSaveController.list);
router.post("/feed/:id/comment", tokenMiddleware, feedCommentController.create);
router.get("/feed/:id/comments", tokenMiddleware, feedCommentController.list);
router.delete(
  "/feed/:feedId/comment",
  tokenMiddleware,
  feedCommentController.delete
);
router.post(
  "/feed/:id/comment/like",
  tokenMiddleware,
  feedCommentController.likeDislike
);

module.exports = router;
