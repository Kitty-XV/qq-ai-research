'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import AICard from '../components/AICard';
import ResultCard from '../components/ResultCard';
import { SearchResult, AISummary } from '../types';

/**
 * 搜索结果页面组件
 * 展示搜索结果和AI智能摘要
 */

// 模拟数据
const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: '人工智能发展现状与未来趋势分析',
    url: 'https://example.com/ai-trends',
    description: '本文深入分析了当前人工智能的发展现状，探讨了未来可能的发展方向和潜在影响。包括机器学习、深度学习、自然语言处理等领域的最新进展。',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    type: 'web',
    metadata: {
      source: '科技日报',
      time: '2024-02-20',
    },
  },
  {
    id: '2',
    title: 'AI应用案例：智能客服系统实践',
    url: 'https://example.com/ai-customer-service',
    description: '详细介绍了某公司如何使用AI技术改造传统客服系统，包括技术选型、实施过程、效果评估等内容。',
    thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    type: 'web',
    metadata: {
      source: '企业技术博客',
      time: '2024-02-19',
    },
  },
  {
    id: '3',
    title: 'AI教程：从零开始学习机器学习',
    url: 'https://example.com/ml-tutorial',
    description: '面向初学者的机器学习入门教程，包含基础概念解释、实践案例和进阶路线图。',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    type: 'web',
    metadata: {
      source: '在线教育平台',
      time: '2024-02-18',
    },
  },
  {
    id: '4',
    title: '人工智能在医疗领域的应用前景',
    url: 'https://example.com/ai-healthcare',
    description: '探讨人工智能技术如何革新医疗健康行业，包括疾病诊断、药物研发、个性化治疗等方面的最新进展。',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
    type: 'web',
    metadata: {
      source: '医疗科技论坛',
      time: '2024-02-17',
    },
  },
  {
    id: '5',
    title: '2024年AI创业投资分析报告',
    url: 'https://example.com/ai-investment',
    description: '全面分析2024年人工智能领域的投资热点、融资趋势和商业机会，为创业者和投资者提供决策参考。',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
    type: 'web',
    metadata: {
      source: '创投周刊',
      time: '2024-02-15',
    },
  },
];

const MOCK_AI_SUMMARY: AISummary = {
  text: `根据对当前人工智能发展状况的全面分析，AI 技术正在以前所未有的速度推动各个领域的创新和变革：

1. 智能客服系统的革新
   ▢ 多模态交互：结合文本、语音、图像的全方位服务
   ▢ 情感识别：能够理解用户情绪，提供个性化回应
   ▢ 业务流程自动化：
     • 自动分类和路由客户请求
     • 智能建议解决方案
     • 24/7 全天候服务支持
   
   📊 效果数据：
   - 响应时间降低 60%
   - 客户满意度提升 35%
   - 人工坐席成本节省 40%

2. 机器学习技术突破
   🔬 关键进展：
   - 大规模预训练模型
   - 自监督学习算法
   - 迁移学习能力提升
   
   💡 应用亮点：
   • 计算机视觉：物体检测准确率达 98%
   • 自然语言处理：多语言翻译质量提升 40%
   • 推荐系统：个性化推荐准确率提高 50%

3. 教育领域的智能化转型
   📚 创新应用：
   - 智能题库和作业系统
   - 个性化学习路径规划
   - 自适应教学内容推荐`,
  sources: [
    '科技日报《人工智能发展现状与未来趋势分析》',
    '企业技术博客《AI应用案例：智能客服系统实践》',
    '在线教育平台《AI教程：从零开始学习机器学习》',
  ],
  timestamp: Date.now(),
  followUpQuestions: [
    'AI在医疗领域有哪些具体应用?',
    '小型企业如何应用AI提升效率?',
    '当前AI技术面临哪些主要挑战?',
  ],
};

// 搜索建议
const SEARCH_SUGGESTIONS = [
  'AI技术最新发展',
  '机器学习框架比较',
  '深度学习实践案例',
  'AI伦理问题研究',
  'AI应用开发教程',
];

// 背景装饰组件
const BackgroundDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--primary-light)]/30 to-transparent"></div>
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary-light)] rounded-full opacity-10 blur-3xl"></div>
    <div className="absolute top-60 -left-20 w-60 h-60 bg-[var(--accent-light)] rounded-full opacity-10 blur-3xl"></div>
  </div>
);

// 搜索内容组件，将useSearchParams()封装在此组件中
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [hasScrolled, setHasScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 模拟搜索结果加载
    if (query) {
      setSearchQuery(query);
      setResults(MOCK_RESULTS);
      
      // 模拟AI摘要加载（有延迟）
      setIsAiLoading(true);
      const timer = setTimeout(() => {
        setAiSummary(MOCK_AI_SUMMARY);
        setIsAiLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [query]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  const handleVoiceSearch = () => {
    alert('语音搜索功能开发中...');
  };

  const handleImageSearch = () => {
    alert('图片搜索功能开发中...');
  };

  const handleRegenerateAi = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setAiSummary(MOCK_AI_SUMMARY);
      setIsAiLoading(false);
    }, 1500);
  };

  const handleCopyAi = () => {
    // 复制功能已在AICard组件内部实现
  };

  const handleAiFeedback = (type: 'positive' | 'negative') => {
    // 反馈功能已在AICard组件内部实现
  };

  const handleFollowUp = (question: string) => {
    handleSearch(question);
  };

  const handleResultSelect = (result: SearchResult) => {
    // 在真实环境中会跳转到结果URL
    window.open(result.url, '_blank');
  };

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(result => result.type === activeTab);

  const resultVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const resultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 relative">
      <BackgroundDecoration />
      
      <header 
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          hasScrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-2' 
            : 'py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-xl font-bold text-[var(--primary-color)] flex items-center gap-2"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M10 16.5L16 12L10 7.5V16.5Z" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline">AI搜索</span>
            </button>
            
            <div className="flex-grow max-w-2xl">
              <SearchBar 
                size="small"
                onSearch={handleSearch}
                onVoiceSearch={handleVoiceSearch}
                onImageSearch={handleImageSearch}
                suggestions={SEARCH_SUGGESTIONS}
              />
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-secondary)] transition-colors">
                设置
              </button>
              <button className="px-3 py-1.5 rounded-full text-sm bg-[var(--primary-light)] text-[var(--primary-color)] hover:bg-[var(--primary-light)]/80 transition-colors">
                登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {query ? (
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="md:w-[230px] lg:w-[280px] shrink-0">
              <div className="sticky top-24">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">搜索类型</h3>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'all'
                            ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text-secondary)]'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
                        </svg>
                        所有结果
                      </button>
                      <button 
                        onClick={() => setActiveTab('web')}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'web'
                            ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text-secondary)]'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V9H13V7ZM13 11H11V17H13V11Z" fill="currentColor"/>
                        </svg>
                        网页
                      </button>
                      <button 
                        onClick={() => setActiveTab('image')}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'image'
                            ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text-secondary)]'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" fill="currentColor"/>
                        </svg>
                        图片
                      </button>
                      <button 
                        onClick={() => setActiveTab('video')}
                        className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'video'
                            ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text-secondary)]'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z" fill="currentColor"/>
                        </svg>
                        视频
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">相关搜索</h3>
                    <div className="space-y-2">
                      {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="flex-grow">
              <AnimatePresence>
                <div className="mb-6">
                  <AICard
                    summary={aiSummary}
                    loading={isAiLoading}
                    onRegenerate={handleRegenerateAi}
                    onCopy={handleCopyAi}
                    onFeedback={handleAiFeedback}
                    onFollowUp={handleFollowUp}
                  />
                </div>
              </AnimatePresence>
              
              {filteredResults.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">搜索结果</h2>
                  
                  {filteredResults.map((result) => (
                    <motion.div 
                      key={result.id}
                      variants={resultItemVariants}
                    >
                      <ResultCard
                        result={result}
                        onSelect={handleResultSelect}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--text-tertiary)]">无搜索结果</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-[var(--text-tertiary)] mb-4">请输入搜索内容</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              返回首页
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border-color)] py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-[var(--text-tertiary)] mb-4 sm:mb-0">
              © 2024 AI Search - Demo版
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--primary-color)] transition-colors">关于</a>
              <a href="#" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--primary-color)] transition-colors">帮助</a>
              <a href="#" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--primary-color)] transition-colors">隐私</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 使用Suspense包装SearchContent组件
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
} 