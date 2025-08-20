import { usePosts } from "../context/PostContext";

export default function Posts() {
  const { posts, newPost, newComment, vote, loading, error } = usePosts();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Post */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          newPost({
            title: form.get("title"),
            description: form.get("description"),
          });
          e.target.reset();
        }}
        className="mb-6"
      >
        <input className="border p-2 mr-2" name="title" placeholder="Title" />
        <input
          className="border p-2 mr-2"
          name="description"
          placeholder="Description"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>

      {posts.map((post) => (
        <div key={post._id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.description}</p>

          {/* Comments */}
          <div className="mt-4">
            <h3 className="font-semibold">Comments:</h3>
            {post.comments.map((c) => (
              <div key={c._id} className="flex items-center gap-2">
                <p>{c.text}</p>
                <button
                  onClick={() => vote("up", c._id)}
                  className="text-green-600"
                >
                  ⬆ {c.upvotes.length}
                </button>
                <button
                  onClick={() => vote("down", c._id)}
                  className="text-red-600"
                >
                  ⬇ {c.downvotes.length}
                </button>
              </div>
            ))}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = e.target.comment.value;
                newComment(post._id, text);
                e.target.reset();
              }}
              className="mt-2 flex gap-2"
            >
              <input
                name="comment"
                className="border p-2 flex-1"
                placeholder="Write a comment"
              />
              <button className="bg-gray-800 text-white px-4 rounded">
                Send
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
