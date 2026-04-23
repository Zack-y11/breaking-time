import { create } from 'zustand';

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  competition_type: 'daily' | 'weekly';
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_junk_ms: number;
  rank: number;
}

interface GroupState {
  groups: Group[];
  activeGroupId: string | null;
  leaderboard: LeaderboardEntry[];
  setGroups: (groups: Group[]) => void;
  setActiveGroup: (id: string | null) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  activeGroupId: null,
  leaderboard: [],
  setGroups: (groups) => set({ groups }),
  setActiveGroup: (activeGroupId) => set({ activeGroupId }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
}));
