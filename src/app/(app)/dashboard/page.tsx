// app/(app)/dashboard/page.tsx
'use client';
import StoriesStrip from './_components/StoriesStrip';
import CreateBox from './_components/CreateBox';
import PostCard from './_components/PostCard';
import type { Post } from './_lib/types';

const DUMMY_POSTS: Post[] = [ /* …placeholder converted from your HTML… */ ];

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <StoriesStrip items={[
        { id:'1', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s', name:'Rider 1' },
        { id:'2', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s', name:'Rider 2' },
        { id:'3', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s', name:'Rider 3' },
      ]}/>
      <CreateBox />
      <section className="space-y-6">
        {DUMMY_POSTS.map(p => <PostCard key={p.id} post={p} />)}
      </section>
    </div>
  );
}

