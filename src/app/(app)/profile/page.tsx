import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';
import { getMyProfile } from './actions';

type U = { _id?: string; id?: string; userName?: string; username?: string; fullName?: string; avatarUrl?: string };

export default async function Page() {
  const c = await cookies();
  if (!c.get('gr_at')?.value) redirect('/login?next=/dashboard/profile');

  let u: U = {};
  try { u = JSON.parse(decodeURIComponent(c.get('gr_user')?.value || '')); } catch {}

  const uid = u._id || u.id;
  const profile = await getMyProfile(uid);

  return <ProfilePageClient profile={profile} />;
}
