import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:text-center">
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">About Us</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Welcome to EduBlog
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          A platform dedicated to sharing educational content and fostering knowledge exchange.
        </p>
      </div>

      <div className="mt-16">
        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <div className="relative">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Our Mission</h3>
            <p className="mt-2 text-base text-gray-500">
              To create an inclusive space where educators and learners can share their knowledge,
              experiences, and insights across various academic disciplines.
            </p>
          </div>

          <div className="relative">
            <h3 className="text-lg font-medium leading-6 text-gray-900">What We Offer</h3>
            <p className="mt-2 text-base text-gray-500">
              A diverse range of educational content spanning mathematics, science, programming,
              literature, and more, all created by our community of passionate educators.
            </p>
          </div>

          <div className="relative">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Community</h3>
            <p className="mt-2 text-base text-gray-500">
              Join our growing community of educators, students, and lifelong learners who are
              committed to sharing knowledge and fostering academic discussions.
            </p>
          </div>

          <div className="relative">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Get Involved</h3>
            <p className="mt-2 text-base text-gray-500">
              Create an account to start sharing your own educational content, engage with other
              users' posts, and become part of our learning community.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-indigo-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-indigo-900 mb-4">Contact Us</h3>
        <p className="text-indigo-700">
          Have questions or suggestions? We'd love to hear from you! Reach out to us at{' '}
          <a href="mailto:contact@edublog.com" className="underline">
            contact@edublog.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default About; 