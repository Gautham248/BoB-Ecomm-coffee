interface MovementTextSectionProps {
    heading?: string;
    content?: string[];
  }
  
  const MovementTextSection = ({ heading, content }: MovementTextSectionProps) => {
    // Configure fonts here - change these to customize typography
    const headingFont = 'font-pangaia font-medium'; // Options: font-serif, font-sans, font-mono, or custom font classes
    const contentFont = 'font-helvetica'; // Options: font-serif, font-sans, font-mono, or custom font classes
    
    // If neither heading nor content is provided, return null
    if (!heading && (!content || content.length === 0)) {
      return null;
    }
    
    return (
      <section className="bg-black min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-2xl">
          <div className="text-left space-y-6 md:space-y-8">
            {heading && (
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${headingFont} text-gray-300 leading-tight tracking-tight`}>
                {heading}
              </h1>
            )}
            
            {content && content.length > 0 && (
              <div className={`space-y-6 md:space-y-8 text-gray-400 text-sm sm:text-base md:text-lg ${contentFont} leading-relaxed`}>
                {content.map((paragraph: string, index: number) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };
  
  export default MovementTextSection;