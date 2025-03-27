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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || 'Post not found'}</p>
        <Link
          to="/blogs"
          className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block"
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-indigo-600">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">
                  • {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {post.title}
              </h1>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">By {post.author.username}</span>
              </div>
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
          </div>

          {/* <div className="mt-6">
            <p className="text-xl text-gray-500 leading-relaxed">{post.description}</p>
          </div> */}

          {/* Render Markdown using marked */}
          <div
            className="mt-8 prose max-w-none"
            dangerouslySetInnerHTML={renderMarkdown(post.content || '')}
          ></div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/blogs" className="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to Blogs
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
