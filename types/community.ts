export type CommunityType = 'public' | 'restricted' | 'private';

export type ContentType = 'posts_and_comments' | 'posts_only';

export interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: CommunityType;
  contentType: ContentType;
  topics: string[];
  isNSFW: boolean;
  memberCount: number;
  creatorId: string;
  createdAt: string;
  bannerUrl?: string;
  iconUrl?: string;
  rules?: string[];
}

export interface CreateCommunityRequest {
  name: string;
  displayName: string;
  description: string;
  type: CommunityType;
  contentType: ContentType;
  topics: string[];
  isNSFW: boolean;
}

export interface CreateCommunityResponse {
  success: boolean;
  community: Community;
  message: string;
}
