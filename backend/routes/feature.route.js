import express from "express";
import {
  getAllPosts,
  createPost,
  commentOnPost,
  upvoteComment,
  downvoteComment,
} from "../controllers/feature.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/posts", getAllPosts);
router.use(authMiddleware);
router.post("/posts", createPost);
router.post("/posts/:postId/comment", commentOnPost);
router.post("/posts/:commentId/comment/upvote", upvoteComment);
router.post("/posts/:commentId/comment/downvote", downvoteComment);

export default router;
