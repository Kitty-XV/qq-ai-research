import { AICardProps } from '../types';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (showCopyTip) {
      const timer = setTimeout(() => setShowCopyTip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopyTip]);

  useEffect(() => {
    if (showFeedbackTip) {
      const timer = setTimeout(() => setShowFeedbackTip(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedbackTip]);

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
    if (inputValue.trim()) {
      onFollowUp(inputValue.trim());
      setInputValue('');
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse space-y-4">
        <div className="flex justify-between items-start mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[var(--primary-light)] rounded-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13H17V11H13V7Z" fill="var(--primary-color)"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            AI 智能摘要
          </h3>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={onRegenerate}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="重新生成"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div className="relative">
            <button
              onClick={handleCopy}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="复制内容"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
            </button>
            {showCopyTip && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap animate-fade-in">
                已复制到剪贴板
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap rounded-xl bg-[var(--primary-light)]/10 p-6 border border-[var(--primary-light)]">
          {summary.text}
        </div>
      </div>

      {summary.sources.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            信息来源
          </p>
          <ul className="space-y-1.5">
            {summary.sources.map((source, index) => (
              <li
                key={index}
                className="text-sm text-[var(--text-tertiary)] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)]"></span>
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 追问部分 */}
      {summary.followUpQuestions && summary.followUpQuestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            您可能想问
          </p>
          <div className="flex flex-wrap gap-2">
            {summary.followUpQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onFollowUp(question)}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--primary-light)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          {/* 追问输入框 */}
          <div className="flex-grow relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入您的追问..."
              className="w-full px-4 py-2 pr-24 rounded-lg border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFollowUpSubmit();
                }
              }}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90 transition-colors"
              onClick={handleFollowUpSubmit}
            >
              追问
            </button>
          </div>

          {/* 反馈按钮 */}
          <div className="relative">
            <button
              onClick={() => handleFeedback('positive')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="有帮助"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 20H4V10H2V20ZM22 10C22 8.9 21.1 8 20 8H13.7L14.7 4.4V4.1C14.7 3.7 14.5 3.3 14.3 3L13.2 2L7.6 7.6C7.2 8 7 8.4 7 9V19C7 20.1 7.9 21 9 21H17C17.8 21 18.5 20.5 18.8 19.8L21.8 12.7C21.9 12.5 22 12.2 22 12V10Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => handleFeedback('negative')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--primary-light)] text-[var(--primary-color)] transition-colors"
              title="需要改进"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 14C22 15.1 21.1 16 20 16H13.7L14.7 19.6V19.9C14.7 20.3 14.5 20.7 14.3 21L13.2 22L7.6 16.4C7.2 16 7 15.6 7 15V5C7 3.9 7.9 3 9 3H17C17.8 3 18.5 3.5 18.8 4.2L21.8 11.3C21.9 11.5 22 11.8 22 12V14ZM2 14H4V4H2V14Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          {showFeedbackTip && (
            <div className="absolute bottom-full mb-2 right-0 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap animate-fade-in">
              {showFeedbackTip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 