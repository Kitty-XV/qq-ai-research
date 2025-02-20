import { NewsIcon, VideoIcon, MailIcon, MapIcon, MusicIcon, ShopIcon } from './icons';

interface QuickLink {
  id: number;
  title: string;
  icon: React.ComponentType;
  url: string;
}

export const QUICK_LINKS: QuickLink[] = [
  {
    id: 1,
    title: '新闻',
    icon: NewsIcon,
    url: 'https://news.qq.com',
  },
  {
    id: 2,
    title: '视频',
    icon: VideoIcon,
    url: 'https://v.qq.com',
  },
  {
    id: 3,
    title: '邮箱',
    icon: MailIcon,
    url: 'https://mail.qq.com',
  },
  {
    id: 4,
    title: '地图',
    icon: MapIcon,
    url: 'https://map.qq.com',
  },
  {
    id: 5,
    title: '音乐',
    icon: MusicIcon,
    url: 'https://y.qq.com',
  },
  {
    id: 6,
    title: '购物',
    icon: ShopIcon,
    url: 'https://shop.qq.com',
  },
];

export default function QuickLinks() {
  return (
    <nav className="glass-effect border-b border-[var(--border-color)]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center -mx-1.5 flex-1">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1.5 px-3 h-8 flex items-center gap-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                >
                  <Icon />
                  <span>{link.title}</span>
                </a>
              );
            })}
          </div>
          <button className="ml-4 px-3 h-8 rounded-full text-sm text-[var(--text-secondary)] hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-[var(--primary-color)] transition-colors">
            编辑
          </button>
        </div>
      </div>
    </nav>
  );
} 