// Preset list of "junk content" apps by Android package name.
// Users can add/remove from this list during onboarding.
// This list is the default starting point.

export interface JunkApp {
  packageName: string;
  displayName: string;
  category: 'social' | 'video' | 'gaming' | 'other';
}

export const PRESET_JUNK_APPS: JunkApp[] = [
  // Short-form video
  { packageName: 'com.zhiliaoapp.musically',         displayName: 'TikTok',           category: 'video' },
  { packageName: 'com.instagram.android',            displayName: 'Instagram',         category: 'social' },
  { packageName: 'com.google.android.youtube',       displayName: 'YouTube',           category: 'video' },
  { packageName: 'com.snapchat.android',             displayName: 'Snapchat',          category: 'social' },
  // Social
  { packageName: 'com.twitter.android',              displayName: 'X (Twitter)',        category: 'social' },
  { packageName: 'com.facebook.katana',              displayName: 'Facebook',           category: 'social' },
  { packageName: 'com.facebook.lite',                displayName: 'Facebook Lite',      category: 'social' },
  { packageName: 'com.reddit.frontpage',             displayName: 'Reddit',             category: 'social' },
  { packageName: 'com.pinterest',                    displayName: 'Pinterest',           category: 'social' },
  { packageName: 'com.linkedin.android',             displayName: 'LinkedIn',            category: 'social' },
  { packageName: 'com.tumblr',                       displayName: 'Tumblr',             category: 'social' },
  // Video streaming
  { packageName: 'com.netflix.mediaclient',          displayName: 'Netflix',            category: 'video' },
  { packageName: 'com.amazon.avod.thirdpartyclient', displayName: 'Prime Video',        category: 'video' },
  { packageName: 'com.disney.disneyplus',            displayName: 'Disney+',            category: 'video' },
  { packageName: 'com.twitch.tv.android',            displayName: 'Twitch',             category: 'video' },
  // Gaming
  { packageName: 'com.kiloo.subwaysurf',             displayName: 'Subway Surfers',     category: 'gaming' },
  { packageName: 'com.supercell.clashofclans',       displayName: 'Clash of Clans',     category: 'gaming' },
  { packageName: 'com.king.candycrushsaga',          displayName: 'Candy Crush',        category: 'gaming' },
];

export const PRESET_PACKAGE_NAMES = PRESET_JUNK_APPS.map((a) => a.packageName);
