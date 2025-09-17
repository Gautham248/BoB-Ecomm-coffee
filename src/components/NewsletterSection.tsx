import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NewsletterSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    gsap.fromTo('.newsletter-content',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      console.log('Newsletter signup:', email);
      // Handle newsletter signup
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-32 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="newsletter-content text-white">
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
              JOIN THE MOVEMENT
            </h2>
            
            <p className="text-xl leading-relaxed mb-12 text-gray-200">
              Fuel your adventure, connect with like-minded explorers, and be part of a community that values purpose, sustainability, and exceptional coffee.
            </p>

            {/* 1% for the Planet */}
            <div className="flex items-center space-x-6 mb-16">
              <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">1%</span>
                </div>
              </div>
              <div>
                <div className="text-4xl font-serif mb-2">1% for the Planet</div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="newsletter-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-white/30 text-white placeholder-white/50 focus:border-white focus:outline-none text-lg"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="flex items-start space-x-3 py-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-white bg-transparent border-white rounded focus:ring-white"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                  By joining, you agree to our Terms & Conditions and consent to receive emails about our exceptional, adventure-fueled products. You can unsubscribe anytime.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-4 px-8 font-medium hover:bg-gray-100 transition-colors duration-300"
                disabled={!email || !agreed}
              >
                REGISTER
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-16 space-y-4">
              <div className="text-right">
                <a href="#" className="text-white hover:text-gray-300 transition-colors block mb-2">Instagram</a>
                <a href="#" className="text-white hover:text-gray-300 transition-colors block mb-2">Youtube</a>
                <a href="#" className="text-white hover:text-gray-300 transition-colors block mb-2">Facebook</a>
                <a href="#" className="text-white hover:text-gray-300 transition-colors block">X</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;