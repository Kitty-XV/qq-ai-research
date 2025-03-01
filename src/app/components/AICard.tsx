import { AICardProps } from '../types';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AI 卡片组件，展示 AI 生成的搜索结果摘要
 * @param {AICardProps} props - 组件属性
 * @returns {JSX.Element} 渲染的 AI 卡片组件
 */
export default function AICard({
  summary,
  loading,
  onRegenerate,
  onCopy,
  onFeedback,
  onFollowUp,
}: AICardProps) {
  const [showCopyTip, setShowCopyTip] = useState(false);
  const [showFeedbackTip, setShowFeedbackTip] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);

  // 增强的文本显示效果
  useEffect(() => {
    if (summary?.text && !isTyping) {
      setIsTyping(true);
      setDisplayedText('');
      
      // 优化的分块逻辑 - 使用更小的文本单位进行更流畅的动画
      // 按照自然语言断句进行分块，但保持更小的单位
      let words = summary.text.split(/(\s+)/);
      let currentLength = 0;
      let chunks: string[] = [];
      let currentChunk = '';
      
      // 按照大约15-20个词一组进行分块，保持句子完整性
      words.forEach(word => {
        currentChunk += word;
        currentLength += word.length;
        
        // 在句子结束且达到一定长度时创建新块
        if ((word.match(/[.!?]$/) || currentLength > 60) && currentChunk.trim().length > 0) {
          chunks.push(currentChunk);
          currentChunk = '';
          currentLength = 0;
        }
      });
      
      // 添加最后一个块(如果有)
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk);
      }
      
      let startTime = performance.now();
      let duration = 1500; // 总持续时间(毫秒)
      
      // 使用requestAnimationFrame实现更流畅的动画
      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 计算当前应该显示到哪个块
        const blockIndex = Math.min(
          Math.floor(progress * chunks.length),
          chunks.length - 1
        );
        
        // 计算最后一个块应该显示的字符数
        let text = chunks.slice(0, blockIndex).join('');
        
        // 对于当前正在显示的块，计算应该显示多少字符
        if (blockIndex < chunks.length) {
          const currentBlock = chunks[blockIndex];
          const blockProgress = (progress * chunks.length) % 1;
          const charsToShow = Math.floor(blockProgress * currentBlock.length);
          text += currentBlock.substring(0, charsToShow);
        }
        
        setDisplayedText(text);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayedText(summary.text);
          setIsTyping(false);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [summary?.text]);

  useEffect(() => {
    if (showCopyTip) {
      const timer = setTimeout(() => setShowCopyTip(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showCopyTip]);

  useEffect(() => {
    if (showFeedbackTip) {
      const timer = setTimeout(() => setShowFeedbackTip(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [showFeedbackTip]);

  useEffect(() => {
    if (textRef.current && !isTyping) {
      textRef.current.scrollTop = 0;
    }
  }, [displayedText, isTyping]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary?.text || '');
    setShowCopyTip(true);
    onCopy();
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    onFeedback(type);
    setShowFeedbackTip(type === 'positive' ? '感谢您的好评！' : '感谢您的反馈！');
  };

  const handleFollowUpSubmit = () => {
    if (inputValue.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // 调用父组件传递的回调函数
        if (typeof onFollowUp === 'function') {
          onFollowUp(inputValue.trim());
        } else {
          console.error('onFollowUp is not a function');
        }
        // 清空输入框
        setInputValue('');
        // 聚焦输入框以便继续输入
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error('Error in handleFollowUpSubmit:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 简化的卡片动画变体
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25 } 
    },
    exit: { 
      opacity: 0,
      y: 5,
      transition: { duration: 0.15 } 
    }
  };

  // 简化的按钮动画变体
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  if (loading) {
    return (
      <motion.div 
        className="card space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 animate-pulse"></div>
        </div>
        <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <motion.div 
      className="card space-y-6 glass-card hover:shadow-md transition-all"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 flex items-center justify-center bg-[var(--primary-light)] rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13H17V11H13V7Z" fill="var(--primary-color)"/>
            </svg>
          </motion.div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            AI 智能摘要
          </h3>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <motion.button
              onClick={onRegenerate}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="重新生成"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
              </svg>
            </motion.button>
          </div>
          <div className="relative">
            <motion.button
              onClick={handleCopy}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="复制内容"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
            </motion.button>
            <AnimatePresence>
              {showCopyTip && (
                <motion.div 
                  className="tooltip absolute top-full mt-2 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                >
                  已复制到剪贴板
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <motion.div 
          ref={textRef}
          className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap rounded-xl bg-[var(--primary-light)]/10 p-6 border border-[var(--primary-light)] max-h-[400px] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayedText}
          {isTyping && (
            <motion.span 
              className="inline-block w-1.5 h-4 ml-0.5 bg-[var(--primary-color)]" 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>

      {summary.sources.length > 0 && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            信息来源
          </p>
          <ul className="space-y-1.5">
            {summary.sources.map((source, index) => (
              <motion.li
                key={index}
                className="text-sm text-[var(--text-tertiary)] flex items-center gap-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--primary-color)]"></span>
                <span className="hover:text-[var(--primary-color)] hover:underline cursor-pointer transition-colors">
                  {source}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* 追问部分 */}
      {summary.followUpQuestions && summary.followUpQuestions.length > 0 && (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            您可能想问
          </p>
          <div className="flex flex-wrap gap-2">
            {summary.followUpQuestions.map((question, index) => (
              <motion.button
                key={index}
                onClick={() => onFollowUp(question)}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--primary-light)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.03 }}
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="pt-4 border-t border-[var(--border-color)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          {/* 追问输入框 */}
          <div className="flex-grow relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入您的追问..."
              className="w-full px-4 py-2 pr-[5.5rem] rounded-lg border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFollowUpSubmit();
                }
              }}
              disabled={isSubmitting}
            />
            <motion.button
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm rounded-lg ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/80'
              } transition-all z-10`}
              onClick={handleFollowUpSubmit}
              whileHover={isSubmitting ? {} : { 
                backgroundColor: 'rgba(0, 102, 255, 0.9)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={isSubmitting ? {} : { 
                backgroundColor: 'rgba(0, 82, 204, 1)',
                y: 1
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : '追问'}
            </motion.button>
          </div>

          {/* 反馈按钮 */}
          <div className="relative">
            <motion.button
              onClick={() => handleFeedback('positive')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="有帮助"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 20H4V10H2V20ZM22 10C22 8.9 21.1 8 20 8H13.7L14.7 4.4V4.1C14.7 3.7 14.5 3.3 14.3 3L13.2 2L7.6 7.6C7.2 8 7 8.4 7 9V19C7 20.1 7.9 21 9 21H17C17.8 21 18.5 20.5 18.8 19.8L21.8 12.7C21.9 12.5 22 12.2 22 12V10Z" fill="currentColor"/>
              </svg>
            </motion.button>
          </div>
          <div className="relative">
            <motion.button
              onClick={() => handleFeedback('negative')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="需要改进"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 14C22 15.1 21.1 16 20 16H13.7L14.7 19.6V19.9C14.7 20.3 14.5 20.7 14.3 21L13.2 22L7.6 16.4C7.2 16 7 15.6 7 15V5C7 3.9 7.9 3 9 3H17C17.8 3 18.5 3.5 18.8 4.2L21.8 11.3C21.9 11.5 22 11.8 22 12V14ZM2 14H4V4H2V14Z" fill="currentColor"/>
              </svg>
            </motion.button>
          </div>
          <AnimatePresence>
            {showFeedbackTip && (
              <motion.div 
                className="tooltip absolute bottom-full mb-2 right-0"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
              >
                {showFeedbackTip}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
} 