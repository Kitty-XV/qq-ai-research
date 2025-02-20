'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import AICard from '../components/AICard';
import ResultCard from '../components/ResultCard';
import { SearchResult, AISummary } from '../types';

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
   - 实时学习效果分析
   
   🎯 具体成果：
   • 学习效率提升 45%
   • 教师工作负担减少 30%
   • 学生参与度增加 55%

4. 医疗健康领域的突破
   🏥 主要应用：
   - 医学影像诊断辅助
   - 药物研发加速
   - 个性化治疗方案制定
   
   📈 实际效果：
   • 诊断准确率提升 40%
   • 药物研发周期缩短 35%
   • 治疗方案优化效率提高 50%

未来发展趋势：
1. 技术融合：AI + 5G + IoT 的深度整合
2. 算力提升：量子计算与神经网络的结合
3. 应用普及：低代码平台推动 AI 民主化
4. 伦理规范：建立更完善的 AI 伦理框架

💡 专家建议：
• 企业应积极布局 AI 技术，建立专门的创新团队
• 重视数据安全和隐私保护
• 加强产学研合作，促进技术转化
• 持续投资人才培养和基础设施建设`,
  sources: [
    '科技日报 - 人工智能发展现状与未来趋势分析（2024年度报告）',
    '企业技术博客 - AI应用案例：智能客服系统最佳实践',
    '教育科技周刊 - AI 教育应用白皮书',
    '医疗创新论坛 - AI 赋能医疗健康产业研究报告',
    'AI 研究院 - 2024 人工智能发展趋势展望'
  ],
  timestamp: Date.now(),
  followUpQuestions: [
    '智能客服系统如何实现情感识别和个性化回应？',
    '机器学习在医疗影像诊断中的具体应用流程是什么？',
    'AI 教育系统如何制定个性化学习路径？',
    '量子计算将如何改变 AI 的发展方向？',
    'AI 伦理框架应该包含哪些关键要素？'
  ],
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results] = useState<SearchResult[]>(MOCK_RESULTS);
  const [aiSummary] = useState<AISummary>(MOCK_AI_SUMMARY);
  const [isLoading, setIsLoading] = useState(false);
  const [followUpTip, setFollowUpTip] = useState<string | null>(null);
  const [searchTime] = useState(() => (Math.random() * 0.5 + 0.1).toFixed(2));

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [query]);

  useEffect(() => {
    if (followUpTip) {
      const timer = setTimeout(() => setFollowUpTip(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [followUpTip]);

  const handleSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleResultSelect = (result: SearchResult) => {
    window.open(result.url, '_blank');
  };

  const handleRegenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiSummary.text);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    // 反馈处理逻辑
  };

  const handleFollowUp = (question: string) => {
    setIsLoading(true);
    setFollowUpTip(`收到追问：${question}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--primary-light)]/20 to-white/20 dark:from-gray-900 dark:to-gray-800">
      <header className="glass-effect sticky top-0 z-50 border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-4 sm:gap-6">
          <div 
            className="hidden sm:flex items-baseline gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <span className="text-lg font-bold bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] text-transparent bg-clip-text">
              QQ浏览器-新一代AI搜索引擎
            </span>
          </div>
          <div className="flex-grow max-w-2xl relative">
            <SearchBar
              size="small"
              onSearch={handleSearch}
              onVoiceSearch={() => alert('语音搜索功能开发中...')}
              onImageSearch={() => alert('图片搜索功能开发中...')}
            />
            {followUpTip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg whitespace-nowrap animate-fade-in z-50">
                {followUpTip}
              </div>
            )}
          </div>
          <button className="text-sm hover:text-[var(--primary-color)] transition-colors">
            设置
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* AI 搜索报告部分 - 移动端在上方，桌面端在左侧 */}
          <div className="w-full lg:w-[600px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <AICard
                summary={aiSummary}
                loading={isLoading}
                onRegenerate={handleRegenerate}
                onCopy={handleCopy}
                onFeedback={handleFeedback}
                onFollowUp={handleFollowUp}
              />
            </div>
          </div>

          {/* 参考网页链接部分 - 移动端在下方，桌面端在右侧 */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">参考资料</h2>
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                （{results.length} 个相关结果）
              </span>
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                •
              </span>
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {searchTime} 秒
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 animate-fade-in">
              {results.map((result) => {
                const { id, title, url, description, type, metadata, thumbnail } = result;
                return (
                  <ResultCard
                    key={id}
                    result={{
                      id,
                      title,
                      url,
                      description,
                      type,
                      metadata,
                      thumbnail
                    }}
                    onSelect={handleResultSelect}
                    compact={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className="glass-effect border-t border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-[var(--text-tertiary)]">
          <p>© 2024 QQ浏览器 AI搜索 - Demo版</p>
        </div>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 