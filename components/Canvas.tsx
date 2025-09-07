
import React, { useState, useEffect } from 'react';
import { BananaIcon } from './icons/BananaIcon';
import { TEXTURES } from '../assets/textures';

interface CanvasProps {
  imageSrc: string;
  isLoading: boolean;
  error: string | null;
  modelVersion: string;
  brightness: number;
  contrast: number;
  texture: string | null;
  textureOpacity: number;
  textureBlendMode: string;
}

const loadingMessages = [
  "Nano Banana is thinking...",
  "Peeling back the pixels...",
  "Consulting the banana bunch...",
  "Adding a dash of potassium...",
  "Going bananas over your request...",
];

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 transition-opacity duration-300">
      <BananaIcon className="w-24 h-24 text-yellow-400 animate-gentle-pulse" />
      <p className="mt-6 text-lg text-gray-300 font-medium tracking-wide">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};


const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex items-center justify-center z-10 p-4">
        <p className="text-center text-white font-semibold">{message}</p>
    </div>
);


export const Canvas: React.FC<CanvasProps> = ({ 
  imageSrc, 
  isLoading, 
  error, 
  modelVersion, 
  brightness, 
  contrast,
  texture,
  textureOpacity,
  textureBlendMode
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative max-w-full max-h-full shadow-2xl bg-black rounded-lg overflow-hidden">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            <img 
                src={imageSrc} 
                alt="Editable canvas" 
                className="block max-w-full max-h-[85vh] object-contain"
                style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            />
            {texture && TEXTURES[texture] && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${TEXTURES[texture]})`,
                  opacity: textureOpacity / 100,
                  mixBlendMode: textureBlendMode as any,
                }}
              />
            )}
            {modelVersion && !isLoading && !error && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 text-center text-xs text-gray-300">
                    <p>{modelVersion}</p>
                </div>
            )}
        </div>
    </div>
  );
};
