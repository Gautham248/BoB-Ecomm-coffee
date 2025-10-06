import React from 'react';

interface VideoHeroSectionProps {
  videoUrl: string;
  headline?: string; // optional
}

const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({ videoUrl, headline }) => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Optional Headline */}
      {headline && (
        <div className="relative z-20 px-6 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-10 py-6">
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-pangaia font-medium tracking-wide text-white leading-relaxed"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoHeroSection;
