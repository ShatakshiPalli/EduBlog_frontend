import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['MATHEMATICS', 'SCIENCE', 'PROGRAMMING', 'HISTORY', 'LITERATURE'];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const post = response.data;
        setFormData({
          title: post.title || '',
          description: post.description || '',
          content: post.content || '',
          category: post.category || 'MATHEMATICS',
          imageUrl: post.imageUrl || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post. Please try again.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/posts/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/dashboard/posts');
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61dafb]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-700">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-[#61dafb] mb-6">Edit Post</h2>

          {error && (
            <div className="mb-6 p-4 bg-[#121212] border-l-4 border-red-500 text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#61dafb]">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md bg-[#121212] border border-gray-700 text-gray-300 focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb]"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#61dafb]">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 rounded-md bg-[#121212] border border-gray-700 text-gray-300 focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#61dafb]">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md bg-[#121212] border border-gray-700 text-gray-300 focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb]"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[#61dafb]">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                required
                className="mt-1 block w-full px-4 py-2 rounded-md bg-[#121212] border border-gray-700 text-gray-300 focus:outline-none focus:border-[#61dafb] focus:ring-1 focus:ring-[#61dafb]"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/posts')}
                className="px-4 py-2 bg-[#121212] text-gray-300 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost; 