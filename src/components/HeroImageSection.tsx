interface HeroSectionProps {
    backgroundUrl: string;
    alt?: string;
  }
  
  const HeroImageSection = ({ backgroundUrl, alt = "Hero background" }: HeroSectionProps) => {
    return (
      <section className="relative w-full h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backgroundUrl}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Optional overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content container - you can add text or other elements here */}
        <div className="relative z-10 h-full flex items-center justify-center">
          {/* Add your hero content here if needed */}
        </div>
      </section>
    );
  };
  
  export default HeroImageSection;