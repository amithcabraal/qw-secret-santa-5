import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useImageNavigation } from '../../hooks/useImageNavigation';
import { useGameStore } from '../../store/gameStore';

export const NavigationControls: React.FC = () => {
  const { showAnswer, toggleAnswer } = useGameStore();
  const { nextImage, previousImage } = useImageNavigation();

  return (
    <div className="absolute left-0 right-0 bottom-8 flex justify-center gap-4">
      <Button 
        variant="icon" 
        onClick={previousImage}
        className="bg-gray-800/80 hover:bg-gray-800/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-110"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      
      <Button 
        onClick={toggleAnswer}
        className="bg-gray-800/80 hover:bg-gray-800/90 backdrop-blur-sm shadow-lg px-6 transition-transform hover:scale-105"
      >
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </Button>
      
      <Button 
        variant="icon" 
        onClick={nextImage}
        className="bg-gray-800/80 hover:bg-gray-800/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-110"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>
    </div>
  );
};