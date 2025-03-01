import { useState, useEffect, useRef } from 'react';
import { HistoryIcon, CloseIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

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

/**
 * 历史搜索侧边栏组件
 * @param {HistorySidebarProps} props - 组件属性
 * @returns {JSX.Element | null} 渲染的侧边栏组件
 */
export default function HistorySidebar({ isOpen, onClose, onSelect }: HistorySidebarProps) {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'text' | 'voice' | 'image'>('all');
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 侧边栏动画变体
  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0.5 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        when: 'beforeChildren',
        staggerChildren: 0.05
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 40,
        when: 'afterChildren',
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  // 历史项动画变体
  const historyItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { 
      x: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  // 按钮动画变体
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    // 模拟历史记录数据，添加更多多样化的数据
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
      {
        id: '4',
        query: '语音搜索示例',
        timestamp: Date.now() - 1000 * 60 * 120,
        type: 'voice',
      },
      {
        id: '5',
        query: '图片搜索示例',
        timestamp: Date.now() - 1000 * 60 * 180,
        type: 'image',
      },
    ]);
  }, []);

  useEffect(() => {
    // 点击外部关闭侧边栏
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

  const getTypeIcon = (type: 'text' | 'voice' | 'image') => {
    switch (type) {
      case 'text':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.5 5.5C2.5 4.12 3.62 3 5 3H19C20.38 3 21.5 4.12 21.5 5.5V18.5C21.5 19.88 20.38 21 19 21H5C3.62 21 2.5 19.88 2.5 18.5V5.5ZM5 5C4.73 5 4.5 5.22 4.5 5.5V18.5C4.5 18.78 4.73 19 5 19H19C19.27 19 19.5 18.78 19.5 18.5V5.5C19.5 5.22 19.27 5 19 5H5Z" />
            <path d="M6 7H18V9H6V7ZM6 11H18V13H6V11ZM6 15H12V17H6V15Z" />
          </svg>
        );
      case 'voice':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.91 11C17.91 13.91 15.7 16.29 12.95 16.87V20H11.05V16.87C8.3 16.29 6.09 13.91 6.09 11H8C8 13.21 9.79 15 12 15C14.21 15 16 13.21 16 11H17.91Z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getHistoryItems = () => {
    if (filter === 'all') {
      return history;
    }
    return history.filter(item => item.type === filter);
  };

  const filteredHistory = getHistoryItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* 侧边栏 */}
          <motion.div
            ref={sidebarRef}
            className="fixed top-0 left-0 h-full w-[min(90vw,384px)] glass-effect border-r border-white/10 shadow-2xl z-50 overflow-hidden"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="h-full flex flex-col">
              {/* 头部 */}
              <motion.div 
                className="px-6 py-5 flex items-center justify-between border-b border-white/10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-full glass-effect flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HistoryIcon className="w-5 h-5 text-[var(--primary-color)]" />
                  </motion.div>
                  <span className="text-lg font-medium text-[var(--text-primary)]">搜索历史</span>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <CloseIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* 筛选器 */}
              <motion.div 
                className="px-6 py-3 border-b border-white/10 flex gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {['all', 'text', 'voice', 'image'].map((type) => (
                  <motion.button
                    key={type}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filter === type 
                        ? 'bg-[var(--primary-color)] text-white' 
                        : 'bg-white/10 text-[var(--text-secondary)] hover:bg-white/20'
                    }`}
                    onClick={() => setFilter(type as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type === 'all' ? '全部' : type === 'text' ? '文本' : type === 'voice' ? '语音' : '图片'}
                  </motion.button>
                ))}
              </motion.div>

              {/* 内容区 */}
              <div className="flex-grow overflow-y-auto">
                {filteredHistory.length > 0 ? (
                  <motion.div 
                    className="p-4 space-y-3"
                    variants={{ 
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                  >
                    <AnimatePresence>
                      {filteredHistory.map((item) => (
                        <motion.div
                          key={item.id}
                          className={`group p-4 rounded-xl glass-card cursor-pointer ${
                            selectedItem === item.id ? 'ring-2 ring-[var(--primary-color)]' : ''
                          }`}
                          onClick={() => {
                            setSelectedItem(item.id);
                            // 添加微小延迟以便动画效果完成
                            setTimeout(() => {
                              onSelect(item.query);
                              onClose();
                            }, 300);
                          }}
                          variants={historyItemVariants}
                          whileHover={{ 
                            y: -3,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                          }}
                          whileTap="tap"
                          layout
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <motion.div 
                              className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                item.type === 'text' 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                  : item.type === 'voice'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                              }`}
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              {getTypeIcon(item.type)}
                            </motion.div>
                            <div className="flex-grow flex justify-between items-center">
                              <span className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors line-clamp-1">
                                {item.query}
                              </span>
                              <span className="text-xs text-[var(--text-tertiary)] group-hover:text-[var(--primary-color)]/70 transition-colors">
                                {formatTime(item.timestamp)}
                              </span>
                            </div>
                          </div>
                          <motion.div 
                            className="pl-8 text-sm text-[var(--text-secondary)]"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: 'auto', 
                              opacity: 1,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <span className="inline-block px-2 py-0.5 bg-white/5 rounded text-xs">
                              {item.type === 'text' ? '文本搜索' : item.type === 'voice' ? '语音搜索' : '图片搜索'}
                            </span>
                            <span className="inline-block ml-2 text-xs text-[var(--text-tertiary)]">
                              #{item.id}
                            </span>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <motion.div 
                      className="w-20 h-20 rounded-full glass-effect flex items-center justify-center mb-4"
                      animate={{ 
                        boxShadow: ["0 0 0 rgba(var(--primary-rgb), 0.3)", "0 0 20px rgba(var(--primary-rgb), 0.6)", "0 0 0 rgba(var(--primary-rgb), 0.3)"],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.5 
                      }}
                    >
                      <HistoryIcon className="w-10 h-10 text-[var(--primary-color)]" />
                    </motion.div>
                    <p className="text-[var(--text-secondary)] mb-2">暂无{filter === 'all' ? '' : filter === 'text' ? '文本' : filter === 'voice' ? '语音' : '图片'}搜索历史</p>
                    <p className="text-xs text-[var(--text-tertiary)]">尝试其他筛选或进行搜索</p>
                  </motion.div>
                )}
              </div>

              {/* 底部 */}
              {filteredHistory.length > 0 && (
                <motion.div 
                  className="p-6 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => setHistory([])}
                    className="w-full h-12 rounded-xl glass-effect text-[var(--primary-color)] hover:bg-white/20 font-medium"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    清除全部历史
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 