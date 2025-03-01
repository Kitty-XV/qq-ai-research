import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBarProps } from '../types';
import { VoiceIcon, ImageIcon, SearchIcon } from './icons';

/**
 * 搜索栏组件 - 重新设计版本
 * @param {SearchBarProps} props - 组件属性
 * @returns {JSX.Element} 渲染的搜索栏组件
 */
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
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 轮换展示的占位符文本
  const placeholders = [
    '探索世界的答案...',
    '有什么想了解的？',
    '搜索你感兴趣的内容...',
    '寻找灵感和创意...',
    '发现新知识...'
  ];

  // 定期更换占位符文本
  useEffect(() => {
    if (!isFocused && !query) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFocused, placeholders.length, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
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
    
    if (feature === 'voice' && onVoiceSearch) {
      onVoiceSearch();
    } else if (feature === 'image' && onImageSearch) {
      onImageSearch();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query || suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // 简化的动画变体
  const containerVariants = {
    rest: { 
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    focus: { 
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: { duration: 0.2 }
    }
  };

  const suggestionVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.03
      }
    },
    exit: { 
      opacity: 0,
      y: -5,
      transition: { duration: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -3 },
    visible: { opacity: 1, y: 0 },
    hover: { backgroundColor: 'rgba(0, 102, 255, 0.08)' }
  };

  const iconButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div
      ref={searchBarRef}
      className={`relative w-full ${size === 'large' ? 'sm:w-[600px]' : 'max-w-2xl'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        variants={containerVariants}
        initial="rest"
        animate={isFocused ? "focus" : isHovered ? "hover" : "rest"}
        className="glass-card rounded-xl overflow-hidden border border-[var(--border-color)]"
      >
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(!!e.target.value || suggestions.length > 0);
            }}
            onFocus={handleFocus}
            className={`w-full px-5 ${
              size === 'large' ? 'text-base py-3.5 sm:py-4' : 'text-base py-3'
            } pr-24 sm:pr-32 bg-transparent focus:outline-none transition-all duration-200 text-[var(--text-primary)]`}
            placeholder=""
          />
          
          <AnimatePresence mode="wait">
            {!query && (
              <motion.span 
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={placeholders[placeholderIndex]}
                transition={{ duration: 0.2 }}
              >
                {placeholders[placeholderIndex]}
              </motion.span>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
          >
            {onVoiceSearch && (
              <motion.button
                type="button"
                onClick={() => handleFeatureClick('voice')}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--text-tertiary)] hover:text-[var(--primary-color)] transition-colors"
                title="语音搜索"
                variants={iconButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <VoiceIcon />
              </motion.button>
            )}
            
            {onImageSearch && (
              <motion.button
                type="button"
                onClick={() => handleFeatureClick('image')}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--text-tertiary)] hover:text-[var(--primary-color)] transition-colors"
                title="图片搜索"
                variants={iconButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <ImageIcon />
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg ${
                query.trim() 
                  ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)]' 
                  : 'bg-gray-100 dark:bg-gray-700 text-[var(--text-tertiary)]'
              } transition-all duration-300`}
              title="搜索"
              variants={iconButtonVariants}
              initial="rest"
              whileHover={query.trim() ? "hover" : "rest"}
              whileTap={query.trim() ? "tap" : "rest"}
              disabled={!query.trim()}
            >
              <SearchIcon />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-sm overflow-hidden z-10"
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                className="w-full px-5 py-3 text-left hover:bg-[var(--primary-light)]/30 dark:hover:bg-gray-700/50 transition-colors text-[var(--text-primary)] flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
                variants={itemVariants}
                whileHover="hover"
              >
                <SearchIcon className="w-4 h-4 mr-3 text-[var(--text-tertiary)]" />
                <span className="line-clamp-1">{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {featureTip && (
          <motion.div 
            className="tooltip absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 bg-gray-800/90 text-white text-xs rounded-lg shadow-sm z-20"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {featureTip}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800/90 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 