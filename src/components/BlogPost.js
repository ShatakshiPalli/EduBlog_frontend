import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { marked } from 'marked';

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
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
        <p className="text-red-600">{error || 'Post not found'}</p>
        <Link
          to="/blogs"
          className="text-[#61dafb] hover:text-[#61dafb]/80 mt-4 inline-block"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  const isAuthor = post.author.username === user?.username;

  // Parse Markdown into HTML
  const renderMarkdown = (markdownContent) => {
    return { __html: marked(markdownContent) };
  };

  return (
    <>
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
          <style>
            {`
              .clr{
                color: #61dafb;
              }
            `}
          </style>
          <h1 className="text-3xl font-bold text-white mb-4 clr">
            {post.title}
          </h1>
          <div className="flex items-center mb-8">
            <span className="text-gray-400">By {post.author?.username}</span>
          </div>

            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/blogs/edit/${post.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}

          {/* Render Markdown using marked */}
          <div
            className="mt-8 prose max-w-none"
            dangerouslySetInnerHTML={renderMarkdown(post.content || '')}
          ></div>
        </div>
      </article>

      <div className="mt-6">
        <Link to="/blogs" className="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to Blogs
        </Link>
      </div>
    </div>
    </>
  );
};

export default BlogPost;
