
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import { SendIcon } from './icons';
import Loader from './Loader';

const ChatBot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful and friendly assistant.'
      }
    });
    setChat(newChat);
    setMessages([{ role: 'model', content: "Hello! How can I help you today?" }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = modelResponse;
            return newMessages;
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the response.");
    } finally {
      setIsLoading(false);
    }
  }, [input, chat]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
             <div className="flex justify-start">
                 <div className="max-w-lg px-4 py-2 rounded-xl bg-gray-600 text-gray-200">
                    <Loader text="Thinking..."/>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <div className="flex-shrink-0 mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Ask me anything..."
          className="flex-grow bg-gray-700 text-gray-200 rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-500 transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
