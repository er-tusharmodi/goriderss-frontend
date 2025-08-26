type Props = {
  user: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    location?: string;
    DOB?: string;
    sex?: string;
    bloodGroup?: string;
  };
};

function label(v?: string, d = '—') {
  return v && String(v).trim() ? v : d;
}

export default function AboutSection({ user }: Props) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">About</h3>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-border rounded-2xl p-4">
            <h4 className="font-semibold mb-3">Contact & Basics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-textmuted min-w-[110px]">Email</span>
                <span className="text-white">{label(user.email)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textmuted min-w-[110px]">Mobile</span>
                <span className="text-white">{label(user.mobileNumber)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textmuted min-w-[110px]">Location</span>
                <span className="text-white">{label(user.location)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textmuted min-w-[110px]">DOB</span>
                <span className="text-white">{label(user.DOB?.slice(0, 10))}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textmuted min-w-[110px]">Sex</span>
                <span className="text-white">
                  {user.sex === 'm' ? 'Male' : user.sex === 'f' ? 'Female' : label(user.sex)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textmuted min-w-[110px]">Blood Group</span>
                <span className="text-white">{label(user.bloodGroup)}</span>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-2xl p-4">
            <h4 className="font-semibold mb-3">Trips Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Completed Trips</span>
                <span className="text-white font-medium">—</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Distance Covered</span>
                <span className="text-white font-medium">— km</span>
              </div>
              <div className="flex items-center justify-between">
                <span>States Covered</span>
                <span className="text-white font-medium">—</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Links (static/dummy) */}
        <div className="space-y-4">
          <div className="border border-border rounded-2xl p-4">
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 text-sm">
                View All Trips
              </a>
              <a href="#" className="block bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 text-sm">
                Ride Portfolio
              </a>
              <a href="#" className="block bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 text-sm">
                Edit Profile
              </a>
            </div>
          </div>
          <div className="border border-border rounded-2xl p-4">
            <h4 className="font-semibold mb-3">Badges</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">Night Rider</span>
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">1000+ km</span>
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">Monsoon Master</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
