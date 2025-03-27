import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect if not authenticated
      return;
    }

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/blogs');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61dafb]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400">{error || 'Post not found'}</p>
        <Link to="/blogs" className="text-[#61dafb] hover:text-[#61dafb]/80 mt-4 inline-block">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const isAuthor = post.author.username === user?.username;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-[#121212] text-[#61dafb] border border-[#61dafb]/20 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center mb-8">
            <span className="text-gray-400">By {post.author?.username}</span>
          </div>

          <div className="prose prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>

          {isAuthor && (
            <div className="mt-8 flex gap-4">
              <Link
                to={`/blogs/edit/${post.id}`}
                className="inline-flex items-center px-4 py-2 border border-[#61dafb] text-sm font-medium rounded-md text-[#61dafb] bg-[#121212] hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-500 bg-[#121212] hover:bg-red-500 hover:text-[#121212] transition-colors duration-200"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
