
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  onApplyEdit,
  onReset,
  onNewImage,
  isLoading,
  hasImage,
}) => {
  return (
    <aside className="w-80 bg-gray-800 p-4 flex flex-col space-y-6 border-r border-gray-700">
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-300">Edit Prompt</h2>
        <p className="text-xs text-gray-500 mb-3">Describe the changes you want to make to the image.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Add a small, red dragon on the shoulder' or 'Change the background to a futuristic city at night'"
          className="w-full h-40 p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none disabled:opacity-50"
          disabled={!hasImage || isLoading}
        />
      </div>

      <div className="flex-grow"></div>

      <div className="space-y-3">
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
