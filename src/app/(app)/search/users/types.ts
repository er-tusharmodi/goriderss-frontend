export type UserSearchItem = {
  id: string;
  name: string;
  username: string;       // "@aarav"
  avatarUrl?: string;
  verified?: boolean;
  location?: string;
  online?: boolean;
  totalRides: number;     // chip 1
  totalKm: number;        // chip 2
  // optional relation flags if backend provides later:
  // following?: boolean;
};
