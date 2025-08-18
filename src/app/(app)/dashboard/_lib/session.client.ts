'use client';

export function getSessionClient() {
  const read = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const userRaw = read('gr_user');
  let user: any = null;
  if (userRaw) {
    try { user = JSON.parse(userRaw); } catch {}
  }
  return { user };
}
