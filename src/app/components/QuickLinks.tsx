import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsIcon, VideoIcon, MailIcon, MapIcon, MusicIcon, ShopIcon } from './icons';

interface QuickLink {
  id: number;
  title: string;
  icon: React.ComponentType;
  url: string;
  color: string;
}

/**
 * 快速链接数据
 * @type {QuickLink[]}
 */
export const QUICK_LINKS: QuickLink[] = [
  {
    id: 1,
    title: '新闻',
    icon: NewsIcon,
    url: 'https://news.qq.com',
    color: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400',
  },
  {
    id: 2,
    title: '视频',
    icon: VideoIcon,
    url: 'https://v.qq.com',
    color: 'from-red-500/20 to-red-600/20 text-red-600 dark:text-red-400',
  },
  {
    id: 3,
    title: '邮箱',
    icon: MailIcon,
    url: 'https://mail.qq.com',
    color: 'from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400',
  },
  {
    id: 4,
    title: '地图',
    icon: MapIcon,
    url: 'https://map.qq.com',
    color: 'from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400',
  },
  {
    id: 5,
    title: '音乐',
    icon: MusicIcon,
    url: 'https://y.qq.com',
    color: 'from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400',
  },
  {
    id: 6,
    title: '购物',
    icon: ShopIcon,
    url: 'https://shop.qq.com',
    color: 'from-pink-500/20 to-pink-600/20 text-pink-600 dark:text-pink-400',
  },
];

/**
 * 快速链接组件
 * @returns {JSX.Element} 渲染的快速链接导航
 */
export default function QuickLinks() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [links, setLinks] = useState<QuickLink[]>(QUICK_LINKS);

  // 简化的链接项动画变体
  const linkVariants = {
    initial: { y: 10, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }),
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    tap: { scale: 0.98 }
  };

  // 简化的编辑模式动画变体
  const editModeVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.15
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  // 移除链接
  const removeLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  // 重置链接
  const resetLinks = () => {
    setLinks(QUICK_LINKS);
    setIsEditMode(false);
  };

  return (
    <nav className="glass-effect border-b border-[var(--border-color)]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14 relative">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar py-2">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.id}
                  href={isEditMode ? undefined : link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 h-9 flex items-center gap-2 rounded-full bg-gradient-to-r ${link.color} backdrop-blur-md transition-all ${
                    isEditMode ? 'cursor-move' : 'cursor-pointer'
                  }`}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  custom={index}
                  whileHover={isEditMode ? undefined : "hover"}
                  whileTap="tap"
                  onHoverStart={() => setHoveredId(link.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                    }
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: hoveredId === link.id ? [0, -5, 5, 0] : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon />
                  </motion.div>
                  <span className="font-medium">{link.title}</span>
                  
                  {isEditMode && (
                    <motion.button
                      className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center ml-1 text-[var(--text-secondary)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLink(link.id);
                      }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 59, 48, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                      </svg>
                    </motion.button>
                  )}
                </motion.a>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <motion.button 
              className={`px-3 h-9 rounded-full text-sm font-medium transition-all ${
                isEditMode 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'bg-white/10 text-[var(--text-secondary)] hover:bg-white/20'
              }`}
              onClick={() => setIsEditMode(!isEditMode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isEditMode ? '完成' : '编辑'}
            </motion.button>
            
            <AnimatePresence>
              {isEditMode && (
                <motion.button 
                  className="px-3 h-9 rounded-full text-sm font-medium bg-white/10 text-[var(--text-secondary)] hover:bg-white/20"
                  onClick={resetLinks}
                  variants={editModeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  重置
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
} 