'use client';

import ImageSlider from './ImageSlider';
import ActionBar from './ActionBar';
import MoreMenu from './MoreMenu';
import CommentList from './CommentList';
import { useState } from 'react';
import type { Post } from '../../_lib/types';

export default function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="post bg-card border border-border rounded-2xl">
      <header className="post-header flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.author.avatarUrl || ''} className="h-9 w-9 rounded-full" alt="avatar"/>
          <div className="leading-tight">
            <div className="username flex items-center gap-1 text-sm font-semibold">
              {post.author.handle || post.author.fullName}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>
            </div>
            <div className="text-xs pb-2 text-textmuted">{post.location || ''} • {/* timeago later */}</div>
          </div>
        </div>
        <MoreMenu />
      </header>

      <div className="mt-1 relative">
        <ImageSlider images={post.images} />
      </div>

      <div className="px-4 pt-2 pb-3 space-y-1">
        <ActionBar liked={post.liked} />
        <div className="text-sm">
          <span className="font-semibold">Liked by </span>
          <span className="font-semibold">someone</span>
          <span className="text-textmuted"> and others</span>
        </div>
        {post.caption && (
          <div className="text-sm">
            <span className="font-semibold">{post.author.handle || post.author.fullName}</span> {post.caption}
          </div>
        )}
        <button className="view-comments text-sm text-textmuted" onClick={() => setShowComments((s) => !s)}>
          {showComments ? 'Hide comments' : `View all ${post.commentsCount ?? 0} comments`}
        </button>

        {showComments && <CommentList comments={post.comments || []} />}

        {/* Add comment */}
        <div className="mt-2 flex items-center gap-2 bg-white/5 rounded-xl p-2">
          <input className="flex-1 bg-transparent outline-none px-2" placeholder="Type your comment here"/>
          <button className="px-3 py-1.5 rounded-full bg-accent text-white">Send</button>
        </div>
      </div>
    </article>
  );
}
