
import React, { useState, useCallback } from 'react';
import { getGroundedSearchResponse } from '../services/geminiService';
import { GroundingChunk } from '../types';
import { SearchCodeIcon, ExternalLinkIcon } from './icons';
import Loader from './Loader';

const GroundedSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const { text, sources } = await getGroundedSearchResponse(query);
      setResult(text);
      setSources(sources.filter(s => s.web));
    } catch (err: any) {
      setError(err.message || 'An error occurred during the search.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
          placeholder="Ask a question about recent events or topics..."
          className="flex-grow bg-gray-700 text-gray-200 rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="flex items-center px-5 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-500 transition-colors"
        >
          <SearchCodeIcon className="w-5 h-5 mr-2" />
          Search
        </button>
      </div>

      <div className="flex-grow bg-gray-700/50 rounded-lg p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader text="Searching the web..." />
          </div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : result ? (
          <div>
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white" dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br />')}} />
            {sources.length > 0 && (
              <div className="mt-6 border-t border-gray-600 pt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Sources:</h3>
                <ul className="space-y-2">
                  {sources.map((source, index) => source.web && (
                    <li key={index}>
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                        <ExternalLinkIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{source.web.title || source.web.uri}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Search results will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundedSearch;
