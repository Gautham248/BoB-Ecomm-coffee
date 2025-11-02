import React, { useEffect, useRef, useState } from 'react';

// Configuration interface for text items with advanced positioning
interface TextItem {
  text: string;
  position: {
    x: number;
    y: number;
    align?: 'left' | 'center' | 'right';
    origin?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    scale?: number;
    maxWidth?: number;
  };
  showAtFrame: number;
  hideAtFrame?: number;
  className?: string;
}

// Pills/Tags item interface
interface PillsItem {
  pills: string[];
  position: {
    x: number;
    y: number;
    align?: 'left' | 'center' | 'right';
    origin?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    scale?: number;
    maxWidth?: number;
  };
  showAtFrame: number;
  hideAtFrame?: number;
}

// Layout configuration
interface LayoutConfig {
  desktop: {
    rightSideX: number;
    rightSideStartY: number;
    elementSpacing: number;
  };
  mobile: {
    leftMargin: number;
    topMargin: number;
    elementSpacing: number;
  };
}

// Animation configuration
interface AnimationConfig {
  moveUpDistance: number;
  fadeOutAfterShow: boolean;
  fadeOutDistance: number;
}

const ScrollImageSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const frameCount = 202;
  
  const imageKitBaseUrl = 'https://ik.imagekit.io/beansofbodhi/Movement-Lottie';
  const imageKitTransform = 'tr:w-1920,q-80';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ========== CONFIGURATION SECTION ==========
  
  const layoutConfig: LayoutConfig = {
    desktop: {
      rightSideX: 850,
      rightSideStartY: 250,
      elementSpacing: 60,
    },
    mobile: {
      leftMargin: 30,
      topMargin: 230,
      elementSpacing: 85,
    }
  };

  const animationConfig: AnimationConfig = {
    moveUpDistance: 20,
    fadeOutAfterShow: false,
    fadeOutDistance: 30,
  };

  // DESKTOP Configuration
  const desktopTextItems: TextItem[] = [
    {
      text: 'Movement',
      position: {
        x: 100,
        y: 200,
        align: 'left',
        origin: 'top-left',
        scale: 1
      },
      showAtFrame: 50,
      className: 'text-7xl font-aviano font-bold'
    },
    {
      text: 'AURA: CNTRL',
      position: {
        x: layoutConfig.desktop.rightSideX,
        y: 200, // Same Y position as MOVEMENT for horizontal alignment
        align: 'left',
        origin: 'top-left',
        scale: 1,
        maxWidth: 500
      },
      showAtFrame: 50,
      className: 'text-3xl font-aviano font-semibold'
    },
    {
      text: 'Your companion between destinations, a mindset for the climbers, surfers and dreamers and the ones who carry rhythm. Crafted for the road and in between. Small enough to fit in your pack, powerful enough to pull a shot, No cords, no limits, just espresso.',
      position: {
        x: layoutConfig.desktop.rightSideX,
        y: 200 + layoutConfig.desktop.elementSpacing, // AURA: CNTRL + spacing
        align: 'left',
        origin: 'top-left',
        scale: 1,
        maxWidth: 450
      },
      showAtFrame: 50,
      className: 'text-base font-helvetica leading-relaxed'
    },
    {
      text: '₹7499',
      position: {
        x: layoutConfig.desktop.rightSideX,
        y: 200 + (layoutConfig.desktop.elementSpacing * 4), // Description + pills + spacing
        align: 'left',
        origin: 'top-left',
        scale: 1,
        maxWidth: 500
      },
      showAtFrame: 50,
      className: 'text-3xl font-bold font-pangaia'
    },
    {
      text: 'Coming Soon',
      position: {
        x: layoutConfig.desktop.rightSideX,
        y: 200 + (layoutConfig.desktop.elementSpacing * 5), // Price + spacing
        align: 'left',
        origin: 'top-left',
        scale: 1
      },
      showAtFrame: 50,
      className: 'text-lg font-aviano font-bold border-2 border-white px-8 py-3 inline-block'
    }
  ];

  // Desktop Pills Configuration
  const desktopPillsItem: PillsItem = {
    pills: ['9 Bars', 'Compact', 'Precision'], // Add or remove items here
    position: {
      x: layoutConfig.desktop.rightSideX,
      y: 200 + (layoutConfig.desktop.elementSpacing * 3), // Description + spacing
      align: 'left',
      origin: 'top-left',
      scale: 1,
      maxWidth: 450
    },
    showAtFrame: 50
  };

  // MOBILE Configuration
  const mobileTextItems: TextItem[] = [
    {
      text: 'Movement',
      position: {
        x: layoutConfig.mobile.leftMargin,
        y: layoutConfig.mobile.topMargin,
        align: 'left',
        origin: 'top-left',
        scale: 0.75
      },
      showAtFrame: 50,
      className: 'text-5xl font-aviano font-bold'
    },
    {
      text: 'Your companion between destinations, a mindset for the climbers, surfers and dreamers and the ones who carry rhythm. Crafted for the road and in between. Small enough to fit in your pack, powerful enough to pull a shot, No cords, no limits, just espresso.',
      position: {
        x: layoutConfig.mobile.leftMargin,
        y: layoutConfig.mobile.topMargin + layoutConfig.mobile.elementSpacing, // MOVEMENT + spacing
        align: 'left',
        origin: 'top-left',
        scale: 1,
        maxWidth: 320
      },
      showAtFrame: 50,
      className: 'text-sm font-helvetica leading-relaxed'
    },
    {
      text: '₹7499',
      position: {
        x: layoutConfig.mobile.leftMargin,
        y: layoutConfig.mobile.topMargin + (layoutConfig.mobile.elementSpacing * 4), // Description + pills + spacing
        align: 'left',
        origin: 'top-left',
        scale: 1.2,
        maxWidth: 320
      },
      showAtFrame: 50,
      className: 'text-4xl font-bold font-pangaia'
    },
    {
      text: 'Coming Soon',
      position: {
        x: layoutConfig.mobile.leftMargin,
        y: layoutConfig.mobile.topMargin + (layoutConfig.mobile.elementSpacing * 5), // Price + spacing
        align: 'left',
        origin: 'top-left',
        scale: 1
      },
      showAtFrame: 50,
      className: 'text-lg font-aviano font-bold border-2 border-white px-8 py-3 inline-block'
    }
  ];

  // Mobile Pills Configuration
  const mobilePillsItem: PillsItem = {
    pills: ['9 Bars', 'Compact', 'Precision'], // Add or remove items here
    position: {
      x: layoutConfig.mobile.leftMargin,
      y: layoutConfig.mobile.topMargin + (layoutConfig.mobile.elementSpacing * 3), // Description + spacing
      align: 'left',
      origin: 'top-left',
      scale: 1,
      maxWidth: 320
    },
    showAtFrame: 50
  };

  // ========== END CONFIGURATION SECTION ==========

  const textItems = isMobile ? mobileTextItems : desktopTextItems;
  const pillsItem = isMobile ? mobilePillsItem : desktopPillsItem;

  const getTransformOrigin = (origin?: string) => {
    if (!origin) return 'top left';
    return origin.replace('-', ' ');
  };

  const getTextStyle = (item: TextItem | PillsItem) => {
    const { showAtFrame, hideAtFrame, position } = item;
    const { moveUpDistance, fadeOutAfterShow, fadeOutDistance } = animationConfig;
    
    let opacity = 0;
    let translateY = moveUpDistance;

    const fadeInStart = Math.max(0, showAtFrame - 20);
    if (currentFrame >= fadeInStart && currentFrame <= showAtFrame) {
      const progress = (currentFrame - fadeInStart) / 20;
      opacity = progress;
      translateY = moveUpDistance * (1 - progress);
    } else if (currentFrame > showAtFrame) {
      if (hideAtFrame && currentFrame >= hideAtFrame) {
        const fadeOutProgress = Math.min(1, (currentFrame - hideAtFrame) / 20);
        opacity = 1 - fadeOutProgress;
        translateY = -fadeOutProgress * moveUpDistance;
      } else if (fadeOutAfterShow) {
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
        opacity = 1;
        translateY = 0;
      }
    }

    const scale = position.scale || 1;

    return {
      position: 'absolute' as const,
      left: position.x >= 0 ? `${position.x}px` : 'auto',
      right: position.x < 0 ? `${Math.abs(position.x)}px` : 'auto',
      top: position.y >= 0 ? `${position.y}px` : 'auto',
      bottom: position.y < 0 ? `${Math.abs(position.y)}px` : 'auto',
      textAlign: position.align || 'left',
      transformOrigin: getTransformOrigin(position.origin),
      maxWidth: position.maxWidth ? `${position.maxWidth}px` : 'none',
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
      transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
    };
  };

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

  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !images[index]) return;

    const img = images[index];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobileView = window.innerWidth < 768;
    const mobileScale = 0.8;
    const desktopScale = 1.0;
    const scaleFactor = isMobileView ? mobileScale : desktopScale;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    
    const mobileHorizontalPosition = 0.45;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height * scaleFactor;
      drawWidth = (img.width * (canvas.height / img.height)) * scaleFactor;
      const horizontalSpace = canvas.width - drawWidth;
      
      if (isMobileView) {
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

      <div 
        ref={containerRef}
        className="relative bg-black"
        style={{ height: '400vh' }}
      >
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

          {!isLoading && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Text Items */}
              {textItems.map((item, index) => (
                <div
                  key={`text-${index}`}
                  style={getTextStyle(item)}
                  className={`text-white ${item.className || ''}`}
                >
                  {item.text}
                </div>
              ))}

              {/* Pills Item */}
              <div style={getTextStyle(pillsItem)}>
                <div className="flex flex-wrap gap-2">
                  {pillsItem.pills.map((pill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm md:text-base text-white/90"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollImageSequence;