import React, { useState, useEffect } from 'react';

const MovementHero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Hero-p-1600.png?updatedAt=1760249831197')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div 
          className={`flex flex-col items-start justify-center min-h-screen transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Text Content */}
          <div className="max-w-2xl">
            <h1 
              className="text-white mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mb-2">
                THE
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic leading-none mb-2">
                ART OF
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic leading-none mb-4">
                ESPRESSO,
              </span>
              <span 
                className="inline-block text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black italic leading-none px-6 py-3 border-4 border-white rounded-2xl"
              >
                LIBERATED
              </span>
            </h1>
          </div>

          {/* Button positioned at bottom right */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
            <button
              disabled
              className="bg-gray-500 text-white font-bold text-sm uppercase px-10 py-4 rounded-md cursor-not-allowed opacity-60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Out of stock
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovementHero;