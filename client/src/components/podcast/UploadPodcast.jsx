import React, { useState } from "react";
import "../../styles/global.css";

const UploadPodcast = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("audio", audio);

    try {
      const response = await fetch("http://localhost:5000/api/podcasts/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      alert("Podcast uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="upload-podcast">
      <h2>Upload a New Podcast</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Cover Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

        <label>Audio File:</label>
        <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} required />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPodcast;
