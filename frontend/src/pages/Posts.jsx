import { useState } from "react";
import { usePosts } from "../context/PostContext";

export default function Posts() {
  const { posts, newPost, newComment, vote, loading, error } = usePosts();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // preview
    }
  };

  // Get user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // simple version: just store lat,lng
          setLocation(`${lat}, ${lng}`);

          // optional: reverse geocode to get readable address
          // using free service like OpenStreetMap Nominatim API
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            if (data.display_name) {
              setLocation(data.display_name);
            }
          } catch (err) {
            console.error("Error fetching address:", err);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to fetch location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // Handle post submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData because of image
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    if (imageFile) formData.append("image", imageFile);

    console.log("formData", formData);
    await newPost({
      title: title,
      description: description,
      image: imageFile,
      location: location,
    });

    // Reset
    setTitle("");
    setDescription("");
    setLocation("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Post */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <input
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          className="border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />

        {/* Location + button */}
        <div className="flex gap-2">
          <input
            className="border p-2 flex-1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />
          <button
            type="button"
            onClick={handleGetLocation}
            className="bg-gray-700 text-white px-3 rounded"
          >
            Get My Location
          </button>
        </div>

        {/* Image upload */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded"
          />
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>

      {/* Render posts */}
      {posts.map((post) => (
        <div key={post._id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.description}</p>

          {post.image && (
            <img
              src={post.image}
              alt="Problem"
              className="w-64 h-auto mt-2 rounded"
            />
          )}
          {post.location && (
            <p className="text-gray-600 mt-2">📍 {post.location}</p>
          )}

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
