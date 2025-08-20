import { createContext, useContext, useState, useEffect } from "react";
import { getPosts, createPost, addComment, upvote, downvote } from "../api";

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const newPost = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await createPost(data);
      fetchPosts();
    } catch (err) {
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const newComment = async (postId, text) => {
    setLoading(true);
    setError(null);
    try {
      await addComment(postId, { comment: text });
      fetchPosts();
    } catch (err) {
      setError("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const vote = async (type, id) => {
    setLoading(true);
    setError(null);
    try {
      if (type === "up") await upvote(id);
      else await downvote(id);
      fetchPosts();
    } catch (err) {
      setError("Failed to vote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, fetchPosts, newPost, newComment, vote, loading, error }}>
      {children}
    </PostContext.Provider>
  );
};
