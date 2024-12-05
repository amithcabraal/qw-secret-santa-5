import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { scaleMaskPosition, getImageDimensions } from '../../utils/maskScaling';

export const ImageDisplay: React.FC = () => {
  const { currentImage, showAnswer } = useGameStore();
  const [maskLoaded, setMaskLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [displayDimensions, setDisplayDimensions] = useState<{ width: number; height: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadOriginalDimensions = async () => {
      try {
        const dimensions = await getImageDimensions(currentImage.imageUrl);
        setOriginalDimensions(dimensions);
      } catch (error) {
        console.error('Error loading image dimensions:', error);
      }
    };
    loadOriginalDimensions();
  }, [currentImage.imageUrl]);

  useEffect(() => {
    const updateDisplayDimensions = () => {
      if (imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        
        setDisplayDimensions({
          width: imageRect.width,
          height: imageRect.height
        });
      }
    };

    if (imageLoaded) {
      updateDisplayDimensions();
      window.addEventListener('resize', updateDisplayDimensions);
      return () => window.removeEventListener('resize', updateDisplayDimensions);
    }
  }, [imageLoaded]);

  const scaledMaskPosition = originalDimensions && displayDimensions
    ? scaleMaskPosition(
        currentImage.maskPosition,
        originalDimensions,
        displayDimensions
      )
    : currentImage.maskPosition;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-full"
        style={{ visibility: maskLoaded && imageLoaded ? 'visible' : 'hidden' }}
      >
        <div className="relative max-h-[80vh] flex items-center justify-center bg-gray-900">
          <img
            ref={imageRef}
            src={currentImage.imageUrl}
            alt="Person"
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
            onLoad={() => setImageLoaded(true)}
          />
          
          {!showAnswer && (
            <img
              src="/santa-mask.png"
              alt="Santa Mask"
              className="absolute pointer-events-none"
              style={{
                left: `${scaledMaskPosition.x}%`,
                top: `${scaledMaskPosition.y}%`,
                transform: `
                  translate(-50%, -50%)
                  scale(${scaledMaskPosition.scale})
                  rotate(${scaledMaskPosition.rotation}deg)
                `,
                width: '150px',
                height: 'auto',
              }}
              onLoad={() => setMaskLoaded(true)}
            />
          )}
        </div>
      </div>
      
      {(!maskLoaded || !imageLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};