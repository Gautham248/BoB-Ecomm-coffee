import React from 'react';

const VideoHeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://ik.imagekit.io/7ujz6ljli/Videos/Bob_Main_Hero__2.mp4?updatedAt=1759676780220"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10" />


    </section>
  );
};

export default VideoHeroSection;