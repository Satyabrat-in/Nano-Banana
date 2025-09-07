
import React from 'react';

interface CanvasProps {
  imageSrc: string;
  isLoading: boolean;
  error: string | null;
  modelVersion: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
    <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-lg text-gray-300">Nano Banana is thinking...</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex items-center justify-center z-10 p-4">
        <p className="text-center text-white font-semibold">{message}</p>
    </div>
);


export const Canvas: React.FC<CanvasProps> = ({ imageSrc, isLoading, error, modelVersion }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative max-w-full max-h-full shadow-2xl bg-black rounded-lg overflow-hidden">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            <img 
                src={imageSrc} 
                alt="Editable canvas" 
                className="max-w-full max-h-[85vh] object-contain"
            />
            {modelVersion && !isLoading && !error && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 text-center text-xs text-gray-300">
                    <p>{modelVersion}</p>
                </div>
            )}
        </div>
    </div>
  );
};
