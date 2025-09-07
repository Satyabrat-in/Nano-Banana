
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { editImageWithGemini } from './services/geminiService';
import type { ImageState } from './types';
import { ImageUploader } from './components/ImageUploader';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageState | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modelVersion, setModelVersion] = useState<string>('');

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage({
        original: { src: base64String, mimeType: file.type },
        current: { src: base64String, mimeType: file.type },
      });
      setModelVersion('');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyEdit = useCallback(async () => {
    if (!image || !prompt || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { newImage, textResponse } = await editImageWithGemini(image.current.src, image.current.mimeType, prompt);
      
      if (newImage) {
        setImage(prev => prev ? { ...prev, current: newImage } : null);
        setModelVersion(textResponse || 'Edit applied successfully.');
      } else {
        setError(textResponse || 'Failed to generate image. Please try a different prompt.');
      }

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to apply edit: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [image, prompt, isLoading]);

  const handleReset = () => {
    setImage(prev => prev ? { ...prev, current: prev.original } : null);
    setModelVersion('');
    setError(null);
  };
  
  const handleNewImage = () => {
    setImage(null);
    setPrompt('');
    setError(null);
    setModelVersion('');
  };


  return (
    <div className="flex flex-col h-screen font-sans bg-gray-800 text-gray-200">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          prompt={prompt}
          setPrompt={setPrompt}
          onApplyEdit={handleApplyEdit}
          onReset={handleReset}
          onNewImage={handleNewImage}
          isLoading={isLoading}
          hasImage={!!image}
        />
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-900 overflow-auto">
          {image ? (
            <Canvas 
              imageSrc={image.current.src} 
              isLoading={isLoading} 
              error={error} 
              modelVersion={modelVersion}
            />
          ) : (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
