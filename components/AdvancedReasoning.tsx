
import React, { useState, useCallback } from 'react';
import { getAdvancedReasoningResponse } from '../services/geminiService';
import { BrainCircuitIcon } from './icons';
import Loader from './Loader';

const AdvancedReasoning: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getAdvancedReasoningResponse(prompt);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="h-full flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-200">Advanced Reasoning with Thinking Mode</h2>
      <p className="text-sm text-gray-400 -mt-3">
        Powered by Gemini 2.5 Pro. Ideal for complex tasks like code generation, multi-step problem solving, and creative writing.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a complex prompt here..."
        className="w-full h-40 bg-gray-700 text-gray-200 rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim()}
        className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-500 transition-colors self-start"
      >
        <BrainCircuitIcon className="w-5 h-5 mr-2" />
        Process Prompt
      </button>

      <div className="flex-grow bg-gray-700/50 rounded-lg p-4 overflow-y-auto mt-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader text="Thinking deeply..." />
          </div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : result ? (
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br />')}}></div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Your complex problem's solution will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedReasoning;
