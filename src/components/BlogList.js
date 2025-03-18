import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BlogList = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [message, setMessage] = useState('');
  const [totalPosts, setTotalPosts] = useState(0);
  const [showingPosts, setShowingPosts] = useState(0);

  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Mathematics', value: 'MATHEMATICS' },
    { name: 'Science', value: 'SCIENCE' },
    { name: 'Programming', value: 'PROGRAMMING' },
    { name: 'History', value: 'HISTORY' },
    { name: 'Literature', value: 'LITERATURE' }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get the token if user is logged in
        const token = user ? localStorage.getItem('token') : null;
        
        const response = await axios.get('http://localhost:8080/api/v1/posts', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (!response.data) {
          throw new Error('No data received from server');
        }

        const { blogs, message, total, showing } = response.data;
        let filteredPosts = blogs;
        
        if (category !== 'all') {
          filteredPosts = blogs.filter(post => post.category === category);
        }
        
        setPosts(Array.isArray(filteredPosts) ? filteredPosts : []);
        setMessage(message || '');
        setTotalPosts(total || 0);
        setShowingPosts(showing || 0);
        setError('');
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to fetch posts. Please try again later.'
        );
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Educational Blog Posts</h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore our collection of educational content
          </p>
        </div>
        {user && (
          <Link
            to="/blogs/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Post
          </Link>
        )}
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={cat.value === 'all' ? '/blogs' : `/blogs?category=${cat.value}`}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm text-blue-700">
            {message} {totalPosts > showingPosts && `(Showing ${showingPosts} of ${totalPosts} posts)`}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-600">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/blogs/${post.id}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {post.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  By {post.author?.username || 'Anonymous'}
                </div>
                <Link
                  to={user ? `/blogs/${post.id}` : '/login'}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            {category === 'all'
              ? 'No posts available yet.'
              : `No posts found in the ${category.toLowerCase()} category.`}
          </p>
          {user && (
            <Link
              to="/blogs/create"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              Create the first post →
            </Link>
          )}
        </div>
      )}

      {!user && posts.length === 0 && !error && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>{' '}
            or{' '}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
              sign up
            </Link>{' '}
            to create your own posts!
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogList; 