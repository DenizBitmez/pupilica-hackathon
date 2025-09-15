import React from 'react';
import { BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8" />
              <h1 className="text-3xl font-historical font-bold">
                Tarih-i Sima
              </h1>
            </div>
            <div className="hidden md:block">
              <p className="text-amber-100 text-sm">
                Yapay Zeka Destekli Tarih Anlatıcısı
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-amber-200" />
            <span className="text-amber-100 text-sm font-medium">
              AI Powered
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
