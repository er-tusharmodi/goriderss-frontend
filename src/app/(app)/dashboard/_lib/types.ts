export type User = {
  id: string;
  fullName: string;
  handle?: string;
  avatarUrl?: string;
  location?: string;
};

export type Comment = {
  id: string;
  author: User;
  text: string;
  createdAt: string; // ISO
  likes?: number;
};

export type Post = {
  id: string;
  author: User;
  createdAt: string; // ISO
  location?: string;
  images: string[];
  liked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  caption?: string;
  comments?: Comment[];
};
export type Notification = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  postId?: string; // Only for like/comment notifications
  commentId?: string; // Only for comment notifications
  createdAt: string; // ISO
  read: boolean;
};
