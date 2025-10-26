
import React, { useState, useRef, useCallback } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadIcon, SparklesIcon } from './icons';
import Loader from './Loader';

const ImageEditor: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImageUrl(null);
      setError(null);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImageFile || !prompt.trim()) {
      setError("Please upload an image and provide an editing prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const base64Image = await fileToBase64(originalImageFile);
      const editedBase64 = await editImageWithGemini(base64Image, originalImageFile.type, prompt);
      setEditedImageUrl(`data:image/png;base64,${editedBase64}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel */}
        <div className="flex flex-col gap-4">
          <div 
            className="flex-grow bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center p-4 cursor-pointer hover:border-purple-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            {originalImageUrl ? (
              <img src={originalImageUrl} alt="Original" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-gray-400">
                <UploadIcon className="mx-auto h-12 w-12" />
                <p className="mt-2">Click to upload an image</p>
                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-gray-700/50 rounded-lg border border-gray-700 flex items-center justify-center p-4">
          {isLoading ? (
            <Loader text="Editing your image..." />
          ) : error ? (
            <div className="text-center text-red-400">
              <p><strong>Error</strong></p>
              <p>{error}</p>
            </div>
          ) : editedImageUrl ? (
            <img src={editedImageUrl} alt="Edited" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500">
              <SparklesIcon className="mx-auto h-12 w-12" />
              <p className="mt-2">Your edited image will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Control Bar */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Add a retro filter, make it black and white..."
          className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-md px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !originalImageFile || !prompt.trim()}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          Generate
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;
