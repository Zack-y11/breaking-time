export interface TitleInfo {
  title: string;
  emoji: string;
}

const TITLE_THRESHOLDS: Array<{ maxMs: number; title: string; emoji: string }> = [
  { maxMs: 0,           title: 'Touched Grass',       emoji: '🌿' },
  { maxMs: 15 * 60000,  title: 'Digital Monk',         emoji: '🧘' },
  { maxMs: 30 * 60000,  title: 'Functioning Human',    emoji: '✅' },
  { maxMs: 60 * 60000,  title: 'Mildly Cooked',        emoji: '📱' },
  { maxMs: 2 * 3600000, title: 'Chronically Online',   emoji: '🌀' },
  { maxMs: 4 * 3600000, title: 'Brain Rotted',         emoji: '🧠' },
  { maxMs: Infinity,    title: 'NPC Mode Activated',   emoji: '🤖' },
];

export function getTitle(dailyJunkMs: number): TitleInfo {
  for (const threshold of TITLE_THRESHOLDS) {
    if (dailyJunkMs <= threshold.maxMs) {
      return { title: threshold.title, emoji: threshold.emoji };
    }
  }
  return { title: 'NPC Mode Activated', emoji: '🤖' };
}

export function formatJunkTime(ms: number): string {
  if (ms === 0) return '0 min';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
