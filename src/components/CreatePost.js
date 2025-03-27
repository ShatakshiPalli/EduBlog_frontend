import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill CSS
import TurndownService from "turndown"; // Import Turndown for HTML-to-Markdown conversion

const CreatePost = () => {
  const navigate = useNavigate();
  const quillRef = useRef(null); // Reference to hold the editor instance
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "GENERAL",
    content: "", // We'll update this after converting to Markdown
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["GENERAL", "MATHEMATICS", "SCIENCE", "PROGRAMMING", "HISTORY", "LITERATURE"];

  const initializeQuill = (ref) => {
    if (ref && !ref.__quill) { // Check if Quill is not already initialized
      const editor = new Quill(ref, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"], // Formatting buttons
            [{ header: [1, 2, 3, false] }],  // Header options
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            ["image"], // Image uploader
          ],
        },
      });

      // Store the Quill instance in the ref
      ref.__quill = editor;

      // Handle image uploads
      editor.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = async () => {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result;
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "image", base64); // Insert base64 image
          };
          reader.readAsDataURL(file);
        };
        input.click();
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const editor = quillRef.current.__quill; // Access the Quill instance
      const htmlContent = editor.root.innerHTML; // Extract HTML content from Quill

      // Convert HTML content to Markdown using Turndown
      const turndownService = new TurndownService();
      const markdownContent = turndownService.turndown(htmlContent);

      const token = localStorage.getItem("token");

      // Combine formData with Markdown content
      const postData = {
        ...formData,
        content: markdownContent, // Send Markdown content as a string
      };

      await axios.post("http://localhost:8080/api/posts", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <div
                ref={(ref) => {
                  quillRef.current = ref;
                  initializeQuill(ref);
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              ></div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
