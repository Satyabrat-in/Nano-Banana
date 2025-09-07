
import React from 'react';
import { GenerateIcon } from './icons/GenerateIcon';
import { ResetIcon } from './icons/ResetIcon';
import { NewImageIcon } from './icons/NewImageIcon';

interface SidebarProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onApplyEdit: () => void;
  onReset: () => void;
  onNewImage: () => void;
  isLoading: boolean;
  hasImage: boolean;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  texture: string | null;
  setTexture: (texture: string | null) => void;
  textureOpacity: number;
  setTextureOpacity: (value: number) => void;
  textureBlendMode: string;
  setTextureBlendMode: (mode: string) => void;
}

const TEXTURE_OPTIONS = ['Dusty', 'Paper', 'Canvas'];
const BLEND_MODES = ['overlay', 'multiply', 'screen'];

export const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  onApplyEdit,
  onReset,
  onNewImage,
  isLoading,
  hasImage,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  texture,
  setTexture,
  textureOpacity,
  setTextureOpacity,
  textureBlendMode,
  setTextureBlendMode,
}) => {
  return (
    <aside className="w-80 bg-gray-800 p-4 flex flex-col space-y-6 border-r border-gray-700 overflow-y-auto">
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-300">Edit Prompt</h2>
        <p className="text-xs text-gray-500 mb-3">Describe the changes you want to make to the image.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Add a small, red dragon on the shoulder' or 'Change the background to a futuristic city at night'"
          className="w-full h-32 p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none disabled:opacity-50"
          disabled={!hasImage || isLoading}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-300">Adjustments</h2>
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="brightness" className="block text-sm font-medium text-gray-400">Brightness</label>
                    <span className="text-xs font-mono text-gray-500">{brightness}%</span>
                </div>
                <input
                    type="range"
                    id="brightness"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    disabled={!hasImage || isLoading}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="contrast" className="block text-sm font-medium text-gray-400">Contrast</label>
                    <span className="text-xs font-mono text-gray-500">{contrast}%</span>
                </div>
                <input
                    type="range"
                    id="contrast"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    disabled={!hasImage || isLoading}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-300">Textures</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {TEXTURE_OPTIONS.map((tex) => (
            <button
              key={tex}
              onClick={() => setTexture(texture === tex ? null : tex)}
              disabled={!hasImage || isLoading}
              className={`py-2 text-xs font-semibold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                texture === tex
                  ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400'
                  : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
              }`}
            >
              {tex}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="textureOpacity" className="block text-sm font-medium text-gray-400">Opacity</label>
              <span className="text-xs font-mono text-gray-500">{textureOpacity}%</span>
            </div>
            <input
              type="range"
              id="textureOpacity"
              min="0"
              max="100"
              value={textureOpacity}
              onChange={(e) => setTextureOpacity(Number(e.target.value))}
              disabled={!hasImage || isLoading || !texture}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Blend Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {BLEND_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTextureBlendMode(mode)}
                  disabled={!hasImage || isLoading || !texture}
                  className={`py-2 text-xs font-semibold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed capitalize ${
                    textureBlendMode === mode
                      ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className="flex-grow"></div>

      <div className="space-y-3 mt-4">
         <button
          onClick={onApplyEdit}
          disabled={!hasImage || isLoading || !prompt}
          className="w-full flex items-center justify-center py-3 px-4 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform disabled:scale-100 hover:scale-105"
        >
          <GenerateIcon className="w-5 h-5 mr-2"/>
          {isLoading ? 'Generating...' : 'Apply Edit'}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onReset}
            disabled={!hasImage || isLoading}
            className="w-full flex items-center justify-center py-2 px-4 bg-gray-600 text-gray-200 font-semibold rounded-md hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 transition"
          >
            <ResetIcon className="w-5 h-5 mr-2"/>
            Reset
          </button>
          <button
            onClick={onNewImage}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 bg-gray-600 text-gray-200 font-semibold rounded-md hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 transition"
          >
            <NewImageIcon className="w-5 h-5 mr-2"/>
            New
          </button>
        </div>
      </div>
    </aside>
  );
};
