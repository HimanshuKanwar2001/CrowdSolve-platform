import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

//get all posts and comments
export const getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate("userId", "name email")
      .populate("comments");

    posts = posts.map((post) => {
      post.comments.sort((a, b) => {
        const upDiff = b.upvotes.length - a.upvotes.length;
        if (upDiff !== 0) return upDiff; // sort by upvotes first
        const downDiff = a.downvotes.length - b.downvotes.length;
        return downDiff; // then fewer downvotes first
      });
      return post;
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller :", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

//post problem
export const createPost = async (req, res) => {
  const { title, description, image, location } = req.body;
  const userId = req.userId; // Assuming userId is set in the request by middleware
  // console.log(req.userId);
  // console.log(userId);
  try {
    const newPost = new Post({
      title,
      description,
      image,
      location,
      userId,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error in createPost controller :", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// Comment on problem
export const commentOnPost = async (req, res) => {
  const postId = req.params.postId;
  const { comment } = req.body;
  const userId = req.userId; // Assuming userId is set in the request by middleware

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      userId,
      postId: post._id, // ✅ Fixed this line
      text: comment,
    });

    await newComment.save();

    // Push the comment into post's comments array
    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Error in commentOnPost controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//upvote comment

export const upvoteComment = async (req, res) => {
  const { commentId } = req.params;
  console.log("commentID", commentId);
  const userId = req.userId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.upvotes.includes(userId)) {
      comment.upvotes.pull(userId);
    } else {
      comment.upvotes.push(userId);
      comment.downvotes.pull(userId);
    }
    await comment.save();
    res.status(200).json({ message: "Comment upvoted successfully", comment });
  } catch (error) {
    console.error("Error in upvoteComment controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//downvote comment
export const downvoteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId; // Assuming userId is set in the request by middleware
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.downvotes.includes(userId)) {
      comment.downvotes.pull(userId);
    } else {
      comment.downvotes.push(userId);
      comment.upvotes.pull(userId);
    }
    await comment.save();
    res
      .status(200)
      .json({ message: "Comment downvoted successfully", comment });
  } catch (error) {
    console.error("Error in downvoteComment controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
