import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecommendedPosts from './RecommendedPosts';
import parse from 'html-react-parser'; // Import html-react-parser

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
        setIsLiked(response.data.likedBy?.includes(user.username));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/posts/${post.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(prev => ({ ...prev, likes: prev.likes + (isLiked ? -1 : 1) }));
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/blogs');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  const toggleReading = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
    } else {
      const speech = new SpeechSynthesisUtterance(post.content);
      speech.onend = () => setIsReading(false);
      window.speechSynthesis.speak(speech);
    }
    setIsReading(!isReading);
  };

  if (loading) return <div>Loading...</div>;
  if (error || !post) return <div>{error || 'Post not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 bg-[#121212] text-[#61dafb] border border-[#61dafb]/20 rounded-full text-sm font-medium">
            {post.category}
          </span>
          <span className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <div className="flex items-center mb-4">
          <span className="text-gray-400">By {post.author?.username}</span>
        </div>

        {/* Like and Read/Stop Buttons */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={handleLikeToggle}
            className="px-4 py-1 text-sm bg-[#121212] text-[#61dafb] border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200"
          >
            <span className="mr-2">{isLiked ? '👍' : 'Like'}</span>
            <span>{post.likes}</span>
          </button>
          <button
            onClick={toggleReading}
            className={`px-4 py-1 text-sm ${
              isReading ? 'bg-red-600 text-white' : 'bg-[#121212] text-[#61dafb]'
            } border border-[#61dafb] rounded-md hover:bg-[#61dafb] hover:text-[#121212] transition-colors duration-200`}
          >
            {isReading ? 'Stop Reading' : 'Read Article'}
          </button>
        </div>

        {/* Render HTML content using html-react-parser */}
        <div className="text-gray-300 leading-relaxed font-sans">
          {parse(post.content)}
        </div>

        {user?.username === post.author?.username && (
          <div className="flex space-x-2 mt-4">
            <Link
              to={`/blogs/edit/${post.id}`}
              className="inline-flex items-center px-3 py-1 text-sm border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1 text-sm border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        )}
      </article>

      <div className="mt-12">
        <RecommendedPosts />
      </div>

      <div className="mt-6">
        <Link to="/blogs" className="text-[#61dafb] font-medium">
          ← Back to Blogs
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
