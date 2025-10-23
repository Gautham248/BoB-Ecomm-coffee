import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo('.story-image',
      { scale: 1.2, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.story-content',
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.3,
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

  const handleDiscoverClick = () => {
    navigate('/our-story');
  };

  const handleCommitmentClick = () => {
    navigate('/our-story');
  };

  return (
    <section ref={sectionRef} className="py-10 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Image */}
          <div className="story-image">
            <img
              src="https://ik.imagekit.io/7ujz6ljli/Story/Western_Ghats.png?updatedAt=1759757310810"
              alt="Western Ghats landscape"
              className="w-full h-48 md:h-80 lg:h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </div>

          {/* Content */}
          <div className="story-content">
            <div className="mb-4 md:mb-6">
              <span className="text-xs md:text-sm font-medium text-gray-600 tracking-wider">OUR STORY</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-pangaia text-gray-900 mb-4 md:mb-8 leading-tight">
            Where Coffee becomes Consciousness 
            </h2>
            
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
            Born in the wild slopes of Western Ghats, it was never just about coffee. It's a story of the land, the hands and the souls behind it. A movement for the restless, the curious and the ones who move with meaning. 

            </p>
            
            <button 
              onClick={handleDiscoverClick}
              className="border border-gray-900 px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300 cursor-pointer"
            >
              DISCOVER
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center mt-16 md:mt-32">
          {/* Content */}
          <div className="story-content lg:order-1">
            <div className="mb-4 md:mb-6">
              <span className="text-xs md:text-sm font-medium text-gray-600 tracking-wider">OUR COMMUNITY 
              </span>
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-pangaia text-gray-900 mb-4 md:mb-8 leading-tight">
            The Earth is a Shareholder 

            </h2>
            
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
            We see two worlds connected by a single cup, The hands that grow our beans, and the hearts that live them. Together, they form the Bodhi community — a cycle of creating, giving and evolving.
            </p>
            
            <button 
              onClick={handleCommitmentClick}
              className="border border-gray-900 px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300 cursor-pointer"
            >
              LEARN MORE
            </button>
          </div>

          {/* Image */}
          <div className="story-image lg:order-2">
            <img
              src="https://ik.imagekit.io/7ujz6ljli/Story/Vo7YbYQQ8iyOo4J9bOoj_ggb24-p-2000.jpg?updatedAt=1759757310766"
              alt="Sustainable farming"
              className="w-full h-48 md:h-80 lg:h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;