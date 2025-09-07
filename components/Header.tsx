
import React from 'react';
import { BananaIcon } from './icons/BananaIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 shadow-md">
      <div className="flex items-center space-x-3">
        <BananaIcon className="w-8 h-8 text-yellow-400" />
        <h1 className="text-xl font-bold text-gray-100 tracking-wider">
          Nano Banana <span className="font-light text-gray-400">Imager</span>
        </h1>
      </div>
      <div className="text-sm text-gray-500">
        Powered by Gemini 2.5 Flash
      </div>
    </header>
  );
};
