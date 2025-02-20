import { useState, useEffect, useRef } from 'react';
import { SearchBarProps } from '../types';
import { VoiceIcon, ImageIcon, SearchIcon } from './icons';

export default function SearchBar({
  size = 'large',
  onSearch,
  onVoiceSearch,
  onImageSearch,
  suggestions = [],
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [featureTip, setFeatureTip] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (featureTip) {
      const timer = setTimeout(() => setFeatureTip(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [featureTip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleFeatureClick = (feature: 'voice' | 'image') => {
    setFeatureTip(`${feature === 'voice' ? '语音' : '图片'}搜索功能开发中...`);
  };

  return (
    <div
      ref={searchBarRef}
      className={`relative w-full ${size === 'large' ? 'sm:w-[600px]' : 'max-w-2xl'} ${className}`}
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          className={`input-search ${
            size === 'large' ? 'text-base sm:text-lg py-3 sm:py-4' : 'text-base py-2'
          } pr-24 sm:pr-32`}
          placeholder="输入搜索内容..."
        />
        <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
          {onVoiceSearch && (
            <div className="relative">
              <button
                type="button"
                onClick={() => handleFeatureClick('voice')}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-all duration-200"
                title="语音搜索"
              >
                <VoiceIcon />
              </button>
            </div>
          )}
          {onImageSearch && (
            <div className="relative">
              <button
                type="button"
                onClick={() => handleFeatureClick('image')}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-all duration-200"
                title="图片搜索"
              >
                <ImageIcon />
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 transition-colors ml-0.5 sm:ml-1"
            title="搜索"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-[var(--border-color)] overflow-hidden animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-6 py-3 text-left hover:bg-[var(--primary-light)]/50 dark:hover:bg-gray-700/50 transition-colors text-[var(--text-primary)]"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {featureTip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap animate-fade-in z-50">
          {featureTip}
        </div>
      )}
    </div>
  );
} 