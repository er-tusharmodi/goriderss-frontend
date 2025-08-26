'use client';

import type { Comment } from '../../_lib/types';

export default function CommentList({ comments }: { comments: Comment[] }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-sm text-textmuted">No comments yet</div>
    );
  }

  return (
    <div className="comments space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.author.avatarUrl || 'https://i.pravatar.cc/40?img=9'} className="h-8 w-8 rounded-full" alt="avatar"/>
          <div className="flex-1">
            <div className="text-sm">
              <span className="font-semibold">{c.author.handle || c.author.fullName}</span>{' '}
              {c.text}
            </div>
            <div className="text-xs text-textmuted mt-1 flex items-center gap-3">
              {/* timeago calc बाद में */}
              <span>just now</span>
              {typeof c.likes === 'number' && <span>{c.likes} Likes</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
