
import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Processing..." }) => (
  <div className="flex flex-col items-center justify-center space-y-2">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
    <p className="text-purple-300 text-sm">{text}</p>
  </div>
);

export default Loader;
