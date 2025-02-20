import { ResultCardProps } from '../types';
import Image from 'next/image';

export default function ResultCard({ result, onSelect, compact = false }: ResultCardProps) {
  const { title, url, description, thumbnail, type, metadata } = result;

  const renderThumbnail = () => {
    if (!thumbnail) return null;

    return (
      <div className={`flex-shrink-0 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300 relative ${
        compact ? 'w-24 h-20' : 'w-40 h-28'
      }`}>
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
    );
  };

  const renderTypeIcon = () => {
    switch (type) {
      case 'web':
        return '🌐';
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
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
    <div
      className="card group cursor-pointer hover:-translate-y-1"
      onClick={() => onSelect(result)}
    >
      <div className={`flex gap-4`}>
        {renderThumbnail()}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{renderTypeIcon()}</span>
            <h3 className={`font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors truncate ${
              compact ? 'text-base' : 'text-lg'
            }`}>
              {title}
            </h3>
          </div>
          
          <p className={`text-[var(--text-secondary)] mb-2 line-clamp-2 ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--primary-color)] truncate">
              {getDomainFromUrl(url)}
            </span>
            <span className="text-[var(--text-tertiary)]">•</span>
            <span className="text-[var(--text-tertiary)] truncate">{metadata.source}</span>
            {!compact && (
              <>
                <span className="text-[var(--text-tertiary)]">•</span>
                <span className="text-[var(--text-tertiary)]">{metadata.time}</span>
              </>
            )}
            <span className="flex-grow"></span>
            {!compact && (
              <a
                href={url}
                className="btn-primary text-sm py-1.5"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
              >
                访问链接
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 