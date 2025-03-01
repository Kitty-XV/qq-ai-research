import { ResultCardProps } from '../types';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * 搜索结果卡片组件
 * @param {ResultCardProps} props - 组件属性
 * @returns {JSX.Element} 渲染的搜索结果卡片
 */
export default function ResultCard({ result, onSelect, compact = false }: ResultCardProps) {
  const { title, url, description, thumbnail, type, metadata } = result;

  const renderThumbnail = () => {
    if (!thumbnail) return null;

    return (
      <div className={`flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl relative ${
        compact ? 'w-20 sm:w-24 h-16 sm:h-20' : 'w-32 sm:w-40 h-24 sm:h-28'
      }`}>
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 160px"
          className="object-cover transition-opacity duration-300 relative z-10 group-hover:opacity-95"
          loading="lazy"
          onLoad={(e) => {
            // 图片加载完成后移除占位动画
            const target = e.target as HTMLImageElement;
            if (target.parentElement) {
              const placeholder = target.parentElement.querySelector('.animate-pulse');
              if (placeholder) placeholder.classList.add('opacity-0');
            }
          }}
        />
      </div>
    );
  };

  const renderTypeIcon = () => {
    switch (type) {
      case 'web':
        return (
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 9L16 13H13V17H11V13H8L12 9Z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'image':
        return (
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'video':
        return (
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" fill="currentColor"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      className="glass-card group cursor-pointer hover:-translate-y-1 hover:shadow-md border-0"
      whileHover={{ 
        y: -3,
        boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)"
      }}
      transition={{ 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={() => onSelect(result)}
    >
      <div className={`flex gap-3 sm:gap-4`}>
        {renderThumbnail()}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            {renderTypeIcon()}
            <h3 className={`font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors truncate ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            }`}>
              {title}
            </h3>
          </div>
          
          <p className={`text-[var(--text-secondary)] mb-2 sm:mb-3 line-clamp-2 ${
            compact ? 'text-xs sm:text-sm' : 'text-sm'
          }`}>
            {description}
          </p>
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            <span className="flex items-center gap-1 text-[var(--primary-color)] truncate">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
              </svg>
              {getDomainFromUrl(url)}
            </span>
            <span className="text-[var(--text-tertiary)]">•</span>
            <span className="flex items-center gap-1 text-[var(--text-tertiary)] truncate">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7 13.5C7.83 13.5 8.5 12.83 8.5 12C8.5 11.17 7.83 10.5 7 10.5C6.17 10.5 5.5 11.17 5.5 12C5.5 12.83 6.17 13.5 7 13.5ZM12 13.5C12.83 13.5 13.5 12.83 13.5 12C13.5 11.17 12.83 10.5 12 10.5C11.17 10.5 10.5 11.17 10.5 12C10.5 12.83 11.17 13.5 12 13.5ZM17 13.5C17.83 13.5 18.5 12.83 18.5 12C18.5 11.17 17.83 10.5 17 10.5C16.17 10.5 15.5 11.17 15.5 12C15.5 12.83 16.17 13.5 17 13.5Z" />
              </svg>
              {metadata.source}
            </span>
            {!compact && (
              <>
                <span className="text-[var(--text-tertiary)]">•</span>
                <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" />
                  </svg>
                  {metadata.time}
                </span>
              </>
            )}
            <span className="flex-grow"></span>
            {!compact && (
              <motion.a
                href={url}
                className="px-3 py-1 text-xs rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)] transition-colors"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                访问链接
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 