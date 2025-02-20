import { useState, useEffect } from 'react';
import { HistoryIcon, CloseIcon } from './icons';

interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
  type: 'text' | 'voice' | 'image';
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (query: string) => void;
}

export default function HistorySidebar({ isOpen, onClose, onSelect }: HistorySidebarProps) {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 模拟历史记录数据
    setHistory([
      {
        id: '1',
        query: '人工智能发展趋势',
        timestamp: Date.now() - 1000 * 60 * 5,
        type: 'text',
      },
      {
        id: '2',
        query: '新能源汽车市场分析',
        timestamp: Date.now() - 1000 * 60 * 30,
        type: 'text',
      },
      {
        id: '3',
        query: '健康饮食指南',
        timestamp: Date.now() - 1000 * 60 * 60,
        type: 'text',
      },
    ]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsAnimating(false);
      onClose();
    }, 500);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  if (!isOpen && !isClosing && !isAnimating) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ease-in-out z-40 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* 侧边栏 */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 ${
          !isAnimating ? '-translate-x-full' : isClosing ? '-translate-x-full' : 'translate-x-0'
        }`}
        onTransitionEnd={() => {
          if (!isOpen && !isClosing) {
            setIsAnimating(false);
          }
        }}
      >
        <div className="h-full flex flex-col">
          {/* 头部 */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                <HistoryIcon className="w-5 h-5 text-[var(--primary-color)]" />
              </div>
              <span className="text-lg font-medium text-[var(--text-primary)]">搜索历史</span>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-all duration-200"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-grow overflow-y-auto">
            {history.length > 0 ? (
              <div className="px-4">
                {history.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group px-4 py-4 rounded-xl hover:bg-white/10 backdrop-blur-lg cursor-pointer transition-all duration-200 ${
                      index !== history.length - 1 ? 'mb-2' : ''
                    }`}
                    onClick={() => {
                      onSelect(item.query);
                      handleClose();
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors line-clamp-1">
                        {item.query}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] group-hover:text-[var(--primary-color)]/70 transition-colors">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-lg text-[var(--primary-color)]">
                        {item.type === 'text' ? '文本' : item.type === 'voice' ? '语音' : '图片'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mb-4">
                  <HistoryIcon className="w-8 h-8 text-[var(--primary-color)]" />
                </div>
                <p className="text-[var(--text-secondary)]">暂无搜索历史</p>
              </div>
            )}
          </div>

          {/* 底部 */}
          {history.length > 0 && (
            <div className="p-6 border-t border-white/10 backdrop-blur-xl">
              <button
                onClick={() => setHistory([])}
                className="w-full h-12 rounded-xl bg-white/10 backdrop-blur-lg text-[var(--primary-color)] hover:bg-white/20 transition-all duration-200 font-medium"
              >
                清除全部历史
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 