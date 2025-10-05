import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { products } from '../data/collections';
import { useCart } from '../context/CartContext';
import logo from '../assets/images/BoB_Logo_small.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { toggleCart, itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo('.header-nav', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const insideItems = [
    {
      title: 'OUR STORY',
      subtitle: 'Learn more about BoB',
      action: () => navigate('/our-story')
    },
    {
      title: 'MOVEMENT',
      subtitle: 'Learn more about Movement',
      action: () => navigate('/movement')
    }
  ];

  const handleDropdownEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleProductClick = (productName: string) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      navigate(`/product/${product.id}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleMovementClick = () => {
    navigate('/movement');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileDropdown = (dropdown: string) => {
    setMobileActiveDropdown(mobileActiveDropdown === dropdown ? null : dropdown);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        {/* Desktop Navigation */}
        <nav className="header-nav hidden md:flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          {/* Left Menu */}
          <div className="flex items-center space-x-8">
            {/* MENU Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('menu')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                <span className="text-sm font-medium tracking-wider">MENU</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'menu' ? 'rotate-180' : ''
                  }`} 
                  aria-hidden="true"
                />
              </button>
              
              {/* Menu Dropdown */}
              <div className={`absolute top-full left-0 w-80 bg-white shadow-2xl transition-all duration-300 ${
                activeDropdown === 'menu' 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-4'
              }`}>
                <div className="py-8 px-6">
                  {products.map((product, index) => (
                    <div 
                      key={product.name} 
                      className="flex items-center space-x-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => handleProductClick(product.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleProductClick(product.name);
                        }
                      }}
                    >
                      <div className="w-6 h-6 border-2 border-gray-800 rounded-full flex-shrink-0" aria-hidden="true"></div>
                      <span className="text-gray-800 font-medium tracking-wide">{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* INSIDE Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('inside')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                <span className="text-sm font-medium tracking-wider">INSIDE</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'inside' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true" 
                />
              </button>
              
              {/* Inside Dropdown */}
              <div className={`absolute top-full left-0 w-80 bg-white shadow-2xl transition-all duration-300 ${
                activeDropdown === 'inside' 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-4'
              }`}>
                <div className="py-8 px-6">
                  {insideItems.map((item, index) => (
                    <div 
                      key={item.title} 
                      className="flex items-center space-x-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      role="menuitem"
                      tabIndex={0}
                      onClick={item.action}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          item.action();
                        }
                      }}
                    >
                      <div className="w-6 h-6 border-2 border-gray-800 rounded-full flex-shrink-0" aria-hidden="true"></div>
                      <span className="text-gray-800 font-medium tracking-wide">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2" role="banner">
            <button onClick={handleLogoClick}>
              <img 
                src={logo} 
                alt="Beans of Bodhi" 
                className="h-12 w-auto"
              />
            </button>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-8">
            <button className="text-white hover:text-gray-300 transition-colors">
              <span className="text-sm font-medium tracking-wider">MAILING LIST</span>
            </button>
            <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
              <span className="text-sm font-medium tracking-wider">INR</span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={toggleCart}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-between px-6 py-4 w-full">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex-shrink min-w-0">
            <img 
              src={logo} 
              alt="Beans of Bodhi" 
              className="h-8 w-auto max-w-[150px]"
            />
          </button>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={toggleCart}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`absolute top-0 left-0 right-0 bg-black/95 backdrop-blur-md transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 w-full">
            <button onClick={handleLogoClick} className="flex-shrink min-w-0">
              <img 
                src={logo} 
                alt="Beans of Bodhi" 
                className="h-8 w-auto max-w-[150px]"
              />
            </button>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <button
                onClick={toggleCart}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-6 py-8 space-y-8">
            {/* MENU Section */}
            <div>
              <button
                onClick={() => toggleMobileDropdown('menu')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-white text-lg font-medium tracking-wider">MENU</span>
                <ChevronDown 
                  className={`w-5 h-5 text-white transition-transform duration-200 ${
                    mobileActiveDropdown === 'menu' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              
              {/* Menu Dropdown */}
              <div className={`mt-4 space-y-2 overflow-hidden transition-all duration-300 ${
                mobileActiveDropdown === 'menu' 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                {products.map((product) => (
                  <button
                    key={product.name}
                    onClick={() => handleProductClick(product.name)}
                    className="flex items-center space-x-3 w-full text-left py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <div className="w-4 h-4 border border-white rounded-full flex-shrink-0" aria-hidden="true"></div>
                    <span className="text-white text-sm">{product.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INSIDE Section */}
            <div>
              <button
                onClick={() => toggleMobileDropdown('inside')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-white text-lg font-medium tracking-wider">INSIDE</span>
                <ChevronDown 
                  className={`w-5 h-5 text-white transition-transform duration-200 ${
                    mobileActiveDropdown === 'inside' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              
              {/* Inside Dropdown */}
              <div className={`mt-4 space-y-2 overflow-hidden transition-all duration-300 ${
                mobileActiveDropdown === 'inside' 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                {insideItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className="w-full text-left py-3 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="w-4 h-4 border border-white rounded-full flex-shrink-0" aria-hidden="true"></div>
                      <span className="text-white font-medium">{item.title}</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-7">{item.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* MAILING LIST Section */}
            <div className="border-t border-gray-800 pt-8">
              <button className="text-white text-lg font-medium tracking-wider hover:text-gray-300 transition-colors">
                MAILING LIST
              </button>
            </div>

            {/* INR Section */}
            <div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-white text-lg font-medium tracking-wider">INR</span>
                <ChevronDown className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;