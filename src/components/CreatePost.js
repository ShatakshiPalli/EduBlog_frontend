import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');

  const categories = [
    { name: 'Select a category', value: '' },
    { name: 'Mathematics', value: 'MATHEMATICS' },
    { name: 'Science', value: 'SCIENCE' },
    { name: 'Programming', value: 'PROGRAMMING' },
    { name: 'History', value: 'HISTORY' },
    { name: 'Literature', value: 'LITERATURE' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-[#61dafb] mb-6">Create New Post</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-[#121212] border-l-4 border-red-500 text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#61dafb] mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#61dafb] mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value} className="bg-[#121212]">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#61dafb] mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              placeholder="Enter a brief description"
            ></textarea>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-[#61dafb] mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              placeholder="Write your post content here"
            ></textarea>
          </div>

          {/* <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-[#61dafb] mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#61dafb]"
              placeholder="Enter image URL"
            />
          </div> */}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 