// app/(app)/dashboard/_lib/types.ts
export type User = {
  id: string;
  fullName: string;
  handle?: string;
  avatarUrl?: string;
  location?: string;
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
  comments?: Array<{
    id: string;
    author: User;
    text: string;
    createdAt: string;
    likes?: number;
  }>;
};
