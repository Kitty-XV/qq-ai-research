'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  '远程工作最佳实践',
  '数字营销策略',
];

const HOT_TOPICS = [
  {
    id: 1,
    title: '全球科技创新峰会',
    category: '科技',
    hot: 9999,
    description: '探讨前沿科技发展趋势，聚焦AI、量子计算等领域的突破性进展',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30'
  },
  {
    id: 2,
    title: '新能源汽车市场分析',
    category: '汽车',
    hot: 8888,
    description: '深度解析新能源汽车行业发展现状，预测未来市场走势',
    bgColor: 'bg-green-50 dark:bg-green-900/30'
  },
  {
    id: 3,
    title: '人工智能伦理讨论',
    category: 'AI',
    hot: 7777,
    description: '探讨AI发展中的伦理问题，平衡技术进步与社会责任',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30'
  },
  {
    id: 4,
    title: '远程办公新趋势',
    category: '职场',
    hot: 6666,
    description: '分析后疫情时代远程办公模式的演变与未来发展方向',
    bgColor: 'bg-orange-50 dark:bg-orange-900/30'
  },
  {
    id: 5,
    title: '可持续发展与环保科技',
    category: '环保',
    hot: 6555,
    description: '关注环保科技创新，探讨可持续发展解决方案',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30'
  },
  {
    id: 6,
    title: '数字货币最新动态',
    category: '金融',
    hot: 6444,
    description: '追踪全球数字货币发展，解读政策变化与市场影响',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30'
  },
  {
    id: 7,
    title: '元宇宙发展前景',
    category: '科技',
    hot: 6333,
    description: '深入分析元宇宙技术进展，展望未来应用场景',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/30'
  },
  {
    id: 8,
    title: '健康科技创新',
    category: '医疗',
    hot: 6222,
    description: '聚焦医疗科技突破，探讨智慧医疗发展趋势',
    bgColor: 'bg-red-50 dark:bg-red-900/30'
  }
];

// 背景装饰元素
const BackgroundElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--primary-light)] rounded-full opacity-20 blur-3xl animate-float"></div>
    <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[var(--accent-light)] rounded-full opacity-20 blur-3xl" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl" style={{ animationDelay: '2s' }}></div>
    
    <svg className="absolute bottom-0 left-0 w-full h-auto opacity-5 dark:opacity-10" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
      <path fill="var(--primary-color)" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,202.7C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [suggestions] = useState(MOCK_SUGGESTIONS);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  // Framer Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg relative">
      <BackgroundElements />
      
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)]/30 backdrop-blur-md bg-transparent">
        <nav className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors mr-2 sm:mr-4 active:scale-95"
              title="搜索历史"
            >
              <MenuIcon />
            </button>
            
            <div className="hidden sm:flex items-center flex-1 -mx-1.5 overflow-x-auto whitespace-nowrap no-scrollbar">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1.5 px-3 h-9 flex items-center gap-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                  >
                    <Icon />
                    <span>{link.title}</span>
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-4">
              <button className="px-3 sm:px-4 h-9 rounded-full text-sm hover:bg-white/20 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                登录
              </button>
              <button className="px-3 sm:px-4 h-9 rounded-full text-sm bg-white/10 hover:bg-white/20 text-[var(--primary-color)] transition-colors">
                设置
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center gap-8 sm:gap-12 px-4 sm:px-6 py-8 sm:py-0">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 sm:space-y-6 pt-4 sm:pt-0"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
            QQ浏览器 AI搜索
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md mx-auto px-4">
            基于大语言模型的新一代搜索引擎
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl px-2"
        >
          <SearchBar
            size="large"
            onSearch={handleSearch}
            onVoiceSearch={handleVoiceSearch}
            onImageSearch={handleImageSearch}
            suggestions={suggestions}
            className="shadow-lg hover:shadow-xl"
          />
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          className="w-full max-w-4xl px-2 sm:px-4"
        >
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                实时热点
              </h2>
              <button 
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1 hover:text-[var(--primary-dark)] transition-colors"
              >
                {showAllTopics ? '收起' : '查看更多'}
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${showAllTopics ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === null
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'bg-white/20 text-[var(--text-secondary)] hover:bg-white/30'
                }`}
              >
                全部
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    category === selectedCategory
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-white/20 text-[var(--text-secondary)] hover:bg-white/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 transition-all duration-500 ${
              showAllTopics ? 'lg:grid-cols-4' : 'lg:grid-cols-4'
            }`}
          >
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                variants={item}
                className={`glass-card relative group cursor-pointer overflow-hidden rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-300`}
                onClick={() => handleSearch(topic.title)}
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 300, damping: 17 }
                }}
              >
                <div className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity ${topic.bgColor}`} />
                
                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/30 backdrop-blur-sm text-[var(--text-primary)] font-medium">
                      {topic.category}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path>
                      </svg>
                      {topic.hot.toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors line-clamp-2 mb-2">
                    {topic.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2">
                    {topic.description}
                  </p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary-light)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <footer className="backdrop-blur-md border-t border-[var(--border-color)]/30 bg-transparent mt-auto">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary-color)">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                AI Search - Demo版 © 2024
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">关于我们</a>
              <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">使用帮助</a>
              <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">隐私协议</a>
              <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">联系我们</a>
            </div>
          </div>
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
