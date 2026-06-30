export interface VocalDNA {
  timbre: string;
  range: string;
  emotion: string;
  clarity: number;
  power: number;
  breathiness: number;
  resonance: number;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  vibe: string[];
  vocalType: string;
  vocalDNA: VocalDNA;
  brandStatement: string;
  story: string;
  influences: string[];
  targetAudience: string[];
  imageUrl?: string;
}

export interface ArtistResponse {
  artists: Artist[];
  total: number;
}

export interface Project {
  id: string;
  hexId: string;
  name: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  artistId: string;
  artistName: string;
  emotion: string;
  intensity: number;
  topic: string;
  createdAt: string;
  songId?: string;
}

export interface QualityScores {
  melody: number;
  harmony: number;
  rhythm: number;
  structure: number;
  production: number;
  vocalPerformance: number;
  lyricQuality: number;
  overall: number;
}

export interface HitPrediction {
  score: number;
  category: string;
  factors: {
    name: string;
    impact: number;
  }[];
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  genres: string[];
  duration: number;
  bpm: number;
  key: string;
  playCount: number;
  likeCount: number;
  qualityScores: QualityScores;
  hitPrediction: HitPrediction;
  lyrics: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface DashboardStats {
  totalSongs: number;
  totalPlays: number;
  totalLikes: number;
  credits: number;
  recentProjects: Project[];
}

export interface CreateProjectRequest {
  artistId: string;
  emotion: string;
  intensity: number;
  topic: string;
}
