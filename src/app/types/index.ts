// 搜索相关类型
export interface SearchQuery {
  text: string;
  timestamp: number;
  type: 'text' | 'voice' | 'image';
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  type: 'web' | 'image' | 'video';
  metadata: {
    source: string;
    time: string;
  };
}

// AI相关类型
export interface AISummary {
  text: string;
  sources: string[];
  timestamp: number;
  followUpQuestions?: string[];
}

// 过滤器相关类型
export interface FilterSettings {
  time?: 'day' | 'week' | 'month' | 'year';
  type?: ('web' | 'image' | 'video')[];
  source?: string[];
}

// 用户偏好设置
export interface UserPreferences {
  aiEnabled: boolean;
  filterSettings: FilterSettings;
  theme: 'light' | 'dark';
}

// 组件Props类型
export interface SearchBarProps {
  size: 'large' | 'small';
  onSearch: (query: string) => void;
  onVoiceSearch?: () => void;
  onImageSearch?: () => void;
  suggestions?: string[];
  className?: string;
}

export interface AICardProps {
  summary: AISummary | null;
  loading: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  onFeedback: (type: 'positive' | 'negative') => void;
  onFollowUp: (question: string) => void;
}

export interface ResultCardProps {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
  compact?: boolean;
} 