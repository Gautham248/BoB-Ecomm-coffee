import React, { useState } from 'react';

const MovementVideoSection: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      {/* Desktop Version - Sticky Wrapper */}
      <div className="hidden md:block relative min-h-screen">
        <div className="sticky top-0 h-screen">
          <div className="relative w-full h-full">
            {/* Placeholder Image */}
            {!videoLoaded && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'src/assets/videos/Movement_Desk_01_1-poster-00001.jpg'
                }}
              />
            )}

            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source
                src="src/assets/videos/Movement_Desk_01_1-transcode.mp4"
                type="video/mp4"
              />
              <source
                src="src/assets/videos/Movement_Desk_01_1-transcode.webm"
                type="video/webm"
              />
            </video>

            {/* Black bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <img
                src="/images/Bob_Home_.svg"
                alt="Beans of Bodhi Movement"
                className="w-64 h-auto mb-8"
              />

              <a
                href="/movement"
                className="inline-block bg-transparent border-2 border-white text-white px-12 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 font-medium"
              >
                MOVEMENT
              </a>
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Static */}
      <div className="block md:hidden relative min-h-screen">
        {/* Placeholder Image */}
        {!videoLoaded && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'src/assets/videos/Movement_Desk_01_1-poster-00001.jpg'
            }}
          />
        )}

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source
            src="src/assets/videos/Movement_Desk_01_1-transcode.mp4"
            type="video/mp4"
          />
          <source
            src="src/assets/videos/Movement_Desk_01_1-transcode.webm"
            type="video/webm"
          />
        </video>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 z-20">
          <a
            href="/movement"
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 font-medium"
          >
            MOVEMENT
          </a>
        </div>

        <img
          src="/images/Bob_Home_.svg"
          alt="Beans of Bodhi Movement"
          className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-auto z-20"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      </div>
    </>
  );
};

export default MovementVideoSection;