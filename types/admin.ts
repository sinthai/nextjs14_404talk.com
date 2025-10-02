export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  avatar?: string;
  bio?: string;
  postCount: number;
  commentCount: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'scheduled';
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  viewCount: number;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  authorName: string;
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

export interface DashboardStats {
  totalUsers: number;
  totalThreads: number;
  totalBlogs: number;
  totalCategories: number;
  newUsersToday: number;
  newThreadsToday: number;
  activeUsers: number;
  reportedContent: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: string;
  timestamp: string;
}

export interface ChartData {
  date: string;
  users: number;
  threads: number;
  blogs: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
