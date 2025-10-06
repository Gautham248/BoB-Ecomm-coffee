import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="story-image">
            <img
              src="https://ik.imagekit.io/7ujz6ljli/Story/Western_Ghats.png?updatedAt=1759757310810"
              alt="Western Ghats landscape"
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </div>

          {/* Content */}
          <div className="story-content">
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-600 tracking-wider">OUR STORY</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-pangaia text-gray-900 mb-8 leading-tight">
              Born in the Heart of Western Ghats
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Beans of Bodhi is where timeless coffee traditions meet the thrill of adventure. 
              From rich, sustainably grown beans to the spirit of exploration in every sip, 
              each cup fuels bold journeys and lasting impact.
            </p>
            
            <button className="border border-gray-900 px-8 py-3 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300">
              DISCOVER
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
          {/* Content */}
          <div className="story-content lg:order-1">
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-600 tracking-wider">COMMITTED TO THE PLANET</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 font-pangaia leading-tight">
              For the planet, its people, and the future we're building together
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Beans of Bodhi is where timeless coffee traditions meet the thrill of adventure. 
              From rich, sustainably grown beans to the spirit of exploration in every sip, 
              each cup fuels bold journeys and lasting impact.
            </p>
          </div>

          {/* Image */}
          <div className="story-image lg:order-2">
            <img
              src="https://ik.imagekit.io/7ujz6ljli/Story/Vo7YbYQQ8iyOo4J9bOoj_ggb24-p-2000.jpg?updatedAt=1759757310766"
              alt="Sustainable farming"
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;