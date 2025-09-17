import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            Copyright © Beans of Bodhi UK. All rights reserved.
          </div>
          
          <div className="flex space-x-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Returns and Warranty</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Legal Mentions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;