export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  stats: {
    threads: number;
    comments: number;
    likes: number;
    followers: number;
    following: number;
  };
  joinedAt: string;
}

export interface UserThread {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  categoryId: string;
  categoryName: string;
  status: 'active' | 'locked' | 'deleted';
  isPinned: boolean;
  viewCount: number;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserComment {
  id: string;
  content: string;
  threadId: string;
  threadTitle: string;
  parentCommentId?: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  threadId: string;
  threadTitle: string;
  threadExcerpt?: string;
  categoryName: string;
  authorName: string;
  bookmarkedAt: string;
}

export interface Notification {
  id: string;
  type: 'comment' | 'reply' | 'vote' | 'mention' | 'follow' | 'system';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserSettings {
  notifications: {
    email: {
      comments: boolean;
      replies: boolean;
      mentions: boolean;
      followers: boolean;
      newsletter: boolean;
    };
    push: {
      comments: boolean;
      replies: boolean;
      mentions: boolean;
    };
  };
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
    allowFollowers: boolean;
  };
  preferences: {
    language: 'th' | 'en';
    theme: 'light' | 'dark' | 'system';
    postsPerPage: number;
  };
}

export interface DashboardStats {
  totalThreads: number;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
  recentActivity: {
    date: string;
    threads: number;
    comments: number;
  }[];
}
