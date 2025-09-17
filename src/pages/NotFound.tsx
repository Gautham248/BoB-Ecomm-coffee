import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';

const NotFound: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Page Not Found - 404"
        description="The page you're looking for doesn't exist. Return to Beans of Bodhi homepage to explore our premium coffee collection."
        noindex={true}
      />
      
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-serif text-gray-900 mb-8">404</h1>
          
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            The page you're looking for seems to have wandered off like coffee beans in the wind. 
            Let's get you back to exploring our premium coffee collection.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors duration-300"
            >
              Return to Homepage
            </Link>
            
            <Link 
              to="/movement" 
              className="inline-block border border-black text-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors duration-300"
            >
              Explore Our Movement
            </Link>
          </div>
          
          {/* Coffee illustration */}
          <div className="mt-16 opacity-20">
            <svg 
              className="w-32 h-32 mx-auto text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;