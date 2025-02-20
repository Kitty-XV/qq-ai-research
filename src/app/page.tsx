'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './components/SearchBar';
import { QUICK_LINKS } from './components/QuickLinks';
import HistorySidebar from './components/HistorySidebar';
import { MenuIcon } from './components/icons';

const MOCK_SUGGESTIONS = [
  '如何提高工作效率',
  '2024年最新技术趋势',
  '健康饮食指南',
  'AI发展前景',
  '环保生活小技巧',
];

const HOT_TOPICS = [
  {
    id: 1,
    title: '全球科技创新峰会',
    category: '科技',
    hot: 9999,
    description: '探讨前沿科技发展趋势，聚焦AI、量子计算等领域的突破性进展'
  },
  {
    id: 2,
    title: '新能源汽车市场分析',
    category: '汽车',
    hot: 8888,
    description: '深度解析新能源汽车行业发展现状，预测未来市场走势'
  },
  {
    id: 3,
    title: '人工智能伦理讨论',
    category: 'AI',
    hot: 7777,
    description: '探讨AI发展中的伦理问题，平衡技术进步与社会责任'
  },
  {
    id: 4,
    title: '远程办公新趋势',
    category: '职场',
    hot: 6666,
    description: '分析后疫情时代远程办公模式的演变与未来发展方向'
  },
  {
    id: 5,
    title: '可持续发展与环保科技',
    category: '环保',
    hot: 6555,
    description: '关注环保科技创新，探讨可持续发展解决方案'
  },
  {
    id: 6,
    title: '数字货币最新动态',
    category: '金融',
    hot: 6444,
    description: '追踪全球数字货币发展，解读政策变化与市场影响'
  },
  {
    id: 7,
    title: '元宇宙发展前景',
    category: '科技',
    hot: 6333,
    description: '深入分析元宇宙技术进展，展望未来应用场景'
  },
  {
    id: 8,
    title: '健康科技创新',
    category: '医疗',
    hot: 6222,
    description: '聚焦医疗科技突破，探讨智慧医疗发展趋势'
  }
];

export default function Home() {
  const router = useRouter();
  const [suggestions] = useState(MOCK_SUGGESTIONS);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleVoiceSearch = () => {
    alert('语音搜索功能开发中...');
  };

  const handleImageSearch = () => {
    alert('图片搜索功能开发中...');
  };

  const displayedTopics = showAllTopics ? HOT_TOPICS : HOT_TOPICS.slice(0, 4);
  
  const categories = Array.from(new Set(HOT_TOPICS.map(topic => topic.category)));
  
  const filteredTopics = selectedCategory
    ? displayedTopics.filter(topic => topic.category === selectedCategory)
    : displayedTopics;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--primary-light)] to-white dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)]/50 bg-gradient-to-b from-[var(--primary-light)] via-[var(--primary-light)] to-transparent backdrop-blur-sm">
        <nav className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors mr-2 sm:mr-4"
              title="搜索历史"
            >
              <MenuIcon />
            </button>
            
            <div className="hidden sm:flex items-center flex-1 -mx-1.5">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1.5 px-3 h-8 flex items-center gap-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                  >
                    <Icon />
                    <span>{link.title}</span>
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-4">
              <button className="px-3 sm:px-4 h-8 rounded-full text-sm hover:bg-white/10 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                登录
              </button>
              <button className="px-3 sm:px-4 h-8 rounded-full text-sm hover:bg-white/10 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                设置
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center gap-8 sm:gap-12 px-4 sm:px-6 py-8 sm:py-0 animate-fade-in">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-transparent bg-clip-text">
            QQ浏览器 AI搜索
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md mx-auto px-4">
            基于人工智能的新一代搜索引擎，为您提供更智能、更精准的搜索体验
          </p>
        </div>

        <div className="w-full max-w-2xl px-2">
          <SearchBar
            size="large"
            onSearch={handleSearch}
            onVoiceSearch={handleVoiceSearch}
            onImageSearch={handleImageSearch}
            suggestions={suggestions}
            className="animate-scale-in"
          />
        </div>

        <div className="w-full max-w-4xl px-2 sm:px-4 animate-fade-in">
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                实时热点
              </h2>
              <button 
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1"
              >
                {showAllTopics ? '收起' : '查看更多'}
                <svg 
                  className={`w-4 h-4 transition-transform ${showAllTopics ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'bg-white/10 text-[var(--text-secondary)] hover:bg-white/20'
                }`}
              >
                全部
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                    category === selectedCategory
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-white/10 text-[var(--text-secondary)] hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 transition-all duration-300 ${
            showAllTopics ? 'lg:grid-cols-4' : 'lg:grid-cols-4'
          }`}>
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="card group cursor-pointer hover:-translate-y-1 p-3 sm:p-4"
                onClick={() => handleSearch(topic.title)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary-color)]">
                    {topic.category}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {topic.hot.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors line-clamp-2 mb-1 sm:mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="glass-effect mt-auto">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-[var(--text-tertiary)]">
          <p>© 2024 AI Search - Demo版</p>
        </div>
      </footer>

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleSearch}
      />
    </div>
  );
}
