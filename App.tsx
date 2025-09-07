import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { editImageWithGemini } from './services/geminiService';
import type { ImageState } from './types';
import { ImageUploader } from './components/ImageUploader';
import { TEXTURES } from './assets/textures';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageState | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modelVersion, setModelVersion] = useState<string>('');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [texture, setTexture] = useState<string | null>(null);
  const [textureOpacity, setTextureOpacity] = useState<number>(50);
  const [textureBlendMode, setTextureBlendMode] = useState<string>('overlay');

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage({
        original: { src: base64String, mimeType: file.type },
        current: { src: base64String, mimeType: file.type },
      });
      setModelVersion('');
      setBrightness(100);
      setContrast(100);
      setTexture(null);
      setTextureOpacity(50);
      setTextureBlendMode('overlay');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyEdit = useCallback(async () => {
    if (!image || !prompt || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
        const getFinalImageData = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  return reject(new Error("Could not get canvas context"));
                }

                const baseImg = new Image();
                baseImg.onload = () => {
                    canvas.width = baseImg.width;
                    canvas.height = baseImg.height;
                    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
                    ctx.drawImage(baseImg, 0, 0);

                    if (texture && TEXTURES[texture]) {
                        const textureImg = new Image();
                        textureImg.onload = () => {
                            ctx.globalAlpha = textureOpacity / 100;
                            // FIX: Cast textureBlendMode to GlobalCompositeOperation. The value is controlled
                            // by a hardcoded list of valid options, so this cast is safe.
                            ctx.globalCompositeOperation = textureBlendMode as GlobalCompositeOperation;
                            const pattern = ctx.createPattern(textureImg, 'repeat');
                            if (pattern) {
                                ctx.fillStyle = pattern;
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                            }
                            // Reset context for subsequent operations
                            ctx.globalAlpha = 1.0;
                            ctx.globalCompositeOperation = 'source-over';
                            resolve(canvas.toDataURL(image.current.mimeType));
                        };
                        textureImg.onerror = () => reject(new Error("Failed to load texture image for editing."));
                        textureImg.src = TEXTURES[texture];
                    } else {
                        // No texture, resolve immediately after drawing base image
                        resolve(canvas.toDataURL(image.current.mimeType));
                    }
                };
                baseImg.onerror = () => reject(new Error("Failed to load base image for editing."));
                baseImg.src = image.current.src;
            });
        };
      
        const finalImageSrc = await getFinalImageData();
        const { newImage, textResponse } = await editImageWithGemini(finalImageSrc, image.current.mimeType, prompt);
      
        if (newImage) {
          setImage(prev => prev ? { ...prev, current: newImage } : null);
          setBrightness(100);
          setContrast(100);
          setTexture(null);
          setTextureOpacity(50);
          setTextureBlendMode('overlay');
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
  }, [image, prompt, isLoading, brightness, contrast, texture, textureOpacity, textureBlendMode]);

  const handleReset = () => {
    setImage(prev => prev ? { ...prev, current: prev.original } : null);
    setModelVersion('');
    setError(null);
    setBrightness(100);
    setContrast(100);
    setTexture(null);
    setTextureOpacity(50);
    setTextureBlendMode('overlay');
  };
  
  const handleNewImage = () => {
    setImage(null);
    setPrompt('');
    setError(null);
    setModelVersion('');
    setBrightness(100);
    setContrast(100);
    setTexture(null);
    setTextureOpacity(50);
    setTextureBlendMode('overlay');
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
          brightness={brightness}
          setBrightness={setBrightness}
          contrast={contrast}
          setContrast={setContrast}
          texture={texture}
          setTexture={setTexture}
          textureOpacity={textureOpacity}
          setTextureOpacity={setTextureOpacity}
          textureBlendMode={textureBlendMode}
          setTextureBlendMode={setTextureBlendMode}
        />
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-900 overflow-auto">
          {image ? (
            <Canvas 
              imageSrc={image.current.src} 
              isLoading={isLoading} 
              error={error} 
              modelVersion={modelVersion}
              brightness={brightness}
              contrast={contrast}
              texture={texture}
              textureOpacity={textureOpacity}
              textureBlendMode={textureBlendMode}
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