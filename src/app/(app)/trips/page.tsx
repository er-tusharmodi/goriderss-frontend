// src/app/(app)/trips/page.tsx
import React from 'react';
import TripsChatClient from './TripsChatClient';

export const metadata = {
  title: 'GoRiderss — Trips & Chat',
};

export default function TripsPage() {
  return (
    <main className="px-4 sm:px-6 py-6">
      <TripsChatClient />
    </main>
  );
}

