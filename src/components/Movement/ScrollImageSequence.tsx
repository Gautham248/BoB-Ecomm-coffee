import React, { useEffect, useRef, useState } from 'react';

// Configuration interface for text items
interface TextItem {
  text: string;
  type: 'title' | 'subtitle' | 'description' | 'custom';
  showAtFrame: number;
  hideAtFrame?: number; // Optional: frame at which text should fade out
  className?: string; // Custom styling
}

// Animation configuration
interface AnimationConfig {
  moveUpDistance: number; // in pixels
  fadeOutAfterShow: boolean; // whether text should fade out after being shown
  fadeOutDistance: number; // how many frames after showAtFrame should it fade out
}

interface ScrollImageSequenceProps {
  textItems?: TextItem[]; // Optional text items
  animationConfig?: Partial<AnimationConfig>; // Optional animation config
  showText?: boolean; // Toggle to show/hide all text
}

const ScrollImageSequence: React.FC<ScrollImageSequenceProps> = ({
  textItems = [],
  animationConfig: customAnimationConfig,
  showText = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const frameCount = 202;
  
  const imageKitBaseUrl = 'https://ik.imagekit.io/beansofbodhi/Movement-Lottie';
  const imageKitTransform = 'tr:w-1920,q-80';

  // Default animation configuration
  const defaultAnimationConfig: AnimationConfig = {
    moveUpDistance: 20,
    fadeOutAfterShow: false,
    fadeOutDistance: 30,
  };

  // Merge custom config with defaults
  const animationConfig = {
    ...defaultAnimationConfig,
    ...customAnimationConfig
  };

  // Calculate opacity and position for each text item
  const getTextStyle = (item: TextItem) => {
    const { showAtFrame, hideAtFrame } = item;
    const { moveUpDistance, fadeOutAfterShow, fadeOutDistance } = animationConfig;
    
    let opacity = 0;
    let translateY = moveUpDistance;

    // Fade in logic (20 frames before showAtFrame to showAtFrame)
    const fadeInStart = Math.max(0, showAtFrame - 20);
    if (currentFrame >= fadeInStart && currentFrame <= showAtFrame) {
      const progress = (currentFrame - fadeInStart) / 20;
      opacity = progress;
      translateY = moveUpDistance * (1 - progress);
    } else if (currentFrame > showAtFrame) {
      // After showAtFrame
      if (hideAtFrame && currentFrame >= hideAtFrame) {
        // Explicit hide at frame
        const fadeOutProgress = Math.min(1, (currentFrame - hideAtFrame) / 20);
        opacity = 1 - fadeOutProgress;
        translateY = -fadeOutProgress * moveUpDistance;
      } else if (fadeOutAfterShow) {
        // Auto fade out after fadeOutDistance frames
        const fadeOutFrame = showAtFrame + fadeOutDistance;
        if (currentFrame >= fadeOutFrame) {
          const fadeOutProgress = Math.min(1, (currentFrame - fadeOutFrame) / 20);
          opacity = 1 - fadeOutProgress;
          translateY = -fadeOutProgress * moveUpDistance;
        } else {
          opacity = 1;
          translateY = 0;
        }
      } else {
        // Stay visible
        opacity = 1;
        translateY = 0;
      }
    }

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
    };
  };

  // Get text element classes based on type
  const getTextClasses = (item: TextItem) => {
    const baseClasses = 'text-white mb-4';
    const typeClasses = {
      title: 'text-4xl md:text-6xl font-bold',
      subtitle: 'text-2xl md:text-3xl font-semibold',
      description: 'text-base md:text-lg leading-relaxed',
      custom: ''
    };
    
    return `${baseClasses} ${item.className || typeClasses[item.type]}`;
  };

  // Preload all images
  useEffect(() => {
    const imageArray: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 0; i <= frameCount; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(5, '0');
        img.src = `${imageKitBaseUrl}/CFE_MKR_RNDR.png_${frameNumber}.png?${imageKitTransform}`;
        
        img.onload = () => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / frameCount) * 100));
          
          if (loadedCount === frameCount) {
            setIsLoading(false);
          }
        };

        img.onerror = () => {
          console.error(`Failed to load image: ${img.src}`);
          loadedCount++;
        };

        imageArray[i] = img;
      }
    };

    preloadImages();
    setImages(imageArray);
  }, []);

  // Draw image on canvas
  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !images[index]) return;

    const img = images[index];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    const mobileScale = 0.8;
    const desktopScale = 0.85;
    const scaleFactor = isMobile ? mobileScale : desktopScale;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    
    const mobileHorizontalPosition = 0.45;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height * scaleFactor;
      drawWidth = (img.width * (canvas.height / img.height)) * scaleFactor;
      const horizontalSpace = canvas.width - drawWidth;
      
      if (isMobile) {
        offsetX = horizontalSpace * mobileHorizontalPosition;
      } else {
        offsetX = horizontalSpace / 2;
      }
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.width * scaleFactor;
      drawHeight = (img.height * (canvas.width / img.width)) * scaleFactor;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Handle scroll with scroll-jacking
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top > 0) {
        setIsFixed(false);
        setIsComplete(false);
        setCurrentFrame(0);
        drawImage(0);
        return;
      }
      
      if (rect.bottom <= windowHeight) {
        setIsFixed(false);
        setIsComplete(true);
        setCurrentFrame(frameCount - 1);
        drawImage(frameCount - 1);
        return;
      }
      
      setIsFixed(true);
      setIsComplete(false);
      
      const scrolledIntoContainer = Math.abs(rect.top);
      const containerHeight = containerRef.current.offsetHeight - windowHeight;
      const progress = Math.min(1, scrolledIntoContainer / containerHeight);
      const frameIndex = Math.floor(progress * (frameCount - 1));
      
      setCurrentFrame(frameIndex);
      drawImage(frameIndex);
    };

    const handleResize = () => {
      drawImage(currentFrame);
    };

    drawImage(0);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [images, isLoading, currentFrame]);

  return (
    <div className="relative">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Loading Product...</h2>
          <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-gray-400 mt-3 text-sm">{loadProgress}%</p>
        </div>
      )}

      {/* Scroll Container */}
      <div 
        ref={containerRef}
        className="relative bg-black"
        style={{ height: '400vh' }}
      >
        {/* Fixed Canvas Container */}
        <div 
          className="w-full h-screen flex items-center justify-center bg-black overflow-hidden"
          style={{
            position: isFixed ? 'fixed' : 'absolute',
            top: isFixed || !isComplete ? 0 : 'auto',
            bottom: isComplete && !isFixed ? 0 : 'auto',
            left: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            style={{ objectFit: 'cover' }}
          />

          {/* Text Overlay - Left Side (Only if showText is true and textItems exist) */}
          {!isLoading && showText && textItems.length > 0 && (
            <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-20 pointer-events-none max-w-xl">
              {textItems.map((item, index) => (
                <div
                  key={index}
                  style={getTextStyle(item)}
                  className={getTextClasses(item)}
                >
                  {item.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollImageSequence;