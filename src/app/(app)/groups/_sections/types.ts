export type GroupDetails = {
  media: string[];
  files: { name: string; size: string }[];
  events: { title: string; time: string; note?: string }[];
  roles: { admin: string[]; mods: string[] };
  rules: string[];
  expense: { total: string; youOwe: string; youGet: string };
  pinned: string | null;
};

export type Group = {
  id: string;
  title: string;
  members: number;
  avatar: string;
  desc: string;
  last: string;
  time: string;
  unread: number;
  details: GroupDetails;
};

export type Message = {
  me: boolean;
  text: string;
  time: string;
  pin?: boolean;
};
