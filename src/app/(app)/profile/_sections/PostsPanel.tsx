export default function PostsPanel() {
  const posts = [
    { t: 'Sunset spin to Nahargarh' },
    { t: 'Monsoon ride, wet roads ❤️' },
    { t: 'Coffee stop at Bagru' },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((p, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://americanathleticshoe.com/cdn/shop/t/23/assets/placeholder_600x.png?v=113555733946226816651665571258" className="w-full aspect-square object-cover" alt="post"/>
          <div className="p-3 text-sm text-textmuted">{p.t}</div>
        </div>
      ))}
    </div>
  );
}
