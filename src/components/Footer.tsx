import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            Copyright © Beans of Bodhi UK. All rights reserved.
          </div>
          
          <div className="flex space-x-8 text-sm">
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-and-conditions" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link 
              to="/refund-and-return" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Refund & Return
            </Link>
            <Link 
              to="/shipping-policy" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;