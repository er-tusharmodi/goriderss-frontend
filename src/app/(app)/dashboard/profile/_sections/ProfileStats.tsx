export default function ProfileStats() {
  return (
    <div className="px-5 sm:px-6 pb-5">
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {[
          { n: '26',  t: 'Trips' },
          { n: '148', t: 'Posts' },
          { n: '1.2k', t: 'Followers' },
          { n: '341', t: 'Following' },
          { n: '58',  t: 'Friends' },
        ].map((x) => (
          <div key={x.t} className="bg-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{x.n}</div>
            <div className="text-xs text-textmuted">{x.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
