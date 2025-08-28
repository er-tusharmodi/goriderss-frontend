// src/app/(app)/profile/[userId]/page.tsx  (OTHER user profile)
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import ProfilePageClient from '../ProfilePageClient';
import { getMyProfile } from '../actions';

type Props = { params: { userId: string } };

export default async function ProfileByIdPage({ params }: Props) {
  const { userId } = params;

  const jar = await cookies();
  if (!jar.get('gr_at')?.value) redirect(`/login?next=${encodeURIComponent(`/profile/${userId}`)}`);

  let me: any = {};
  try { me = JSON.parse(decodeURIComponent(jar.get('gr_user')?.value || '')); } catch {}
  const meId = me?._id || me?.id || null;

  if (meId && meId === userId) redirect('/profile');

  try {
    const profile = await getMyProfile(userId);
    if (!profile?.id) notFound();
    return <ProfilePageClient profile={profile} meId={meId} />;
  } catch {
    notFound();
  }
}
