import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateTripClient from './CreateTripClient';

export default async function Page() {
  const jar = await cookies();
  const at = jar.get('gr_at')?.value || jar.get('accessToken')?.value;
  if (!at) redirect('/login?next=/trips/create');

  return <CreateTripClient />;
}
