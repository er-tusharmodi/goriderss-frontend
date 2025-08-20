// app/(app)/dashboard/profile/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';

type U = { userName?: string; username?: string; fullName?: string; avatarUrl?: string };
const isUrl = (v?: string) => !!v && /^https?:\/\//i.test(v);

export default async function Page() {
  const c = await cookies();                           // await to satisfy Next dynamic API
  if (!c.get('gr_at')?.value) redirect('/login?next=/dashboard/profile');

  let u: U = {};
  try { u = JSON.parse(decodeURIComponent(c.get('gr_user')?.value || '')); } catch {}

  const userName = u.userName || u.username || u.fullName || '—';
  const fullName = u.fullName && u.fullName !== userName ? u.fullName : '';
  const avatarUrl = isUrl(u.avatarUrl) ? u.avatarUrl! : '/assets/dummyUser.png';

  return <ProfilePageClient user={{ userName, fullName, avatarUrl }} />;
}
