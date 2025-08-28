"use client";
import UserCard from "./UserCard";
import type { UserSearchItem } from "../types";

export default function ResultsGrid({ items }: { items: UserSearchItem[] }) {
  return (
    <>
      {items.map((u) => (
        <UserCard key={String(u.id)} user={u} />
      ))}
    </>
  );
}
