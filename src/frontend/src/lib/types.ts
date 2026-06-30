export interface BackendArtist {
  id: string;
  name: string;
  genre: string[];
  vibe: string[];
  vocal_type: string;
  vocal_texture: string[];
  vocal_technique: string[];
  delivery_style: string[];
  influences: string[];
  brand: string;
  target_audience: any;
  story: string;
}

export interface BackendProject {
  id: string;
  artist_id: string;
  hex_id: string;
  structure: string;
  topic: string;
  duration: number;
  status: string;
  emotion: string;
  intensity: number;
  created_at: string;
}

export interface BackendSong {
  id: string;
  project_id: string;
  artist_id: string;
  title: string;
  lyrics: string;
  audio_url: string;
  poster_url: string | null;
  duration: number | null;
  genre: string | null;
  bpm: number | null;
  musical_key: string | null;
  quality_score: any | null;
  hit_prediction: any | null;
  plays: number;
  likes: number;
  shares: number;
  generated_at: string;
}

export interface BackendDashboardStats {
  total_projects: number;
  total_songs: number;
  total_plays: number;
  total_likes: number;
  average_quality: number;
  credits_remaining: number;
}

export interface BackendQueueStatus {
  queue_id: string;
  project_id: string;
  status: string;
  progress: number;
  stage: string;
}

// Frontend-friendly camelCase types (used by components)
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
  factors: { name: string; impact: number }[];
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
  artist_id: string;
  hex_id: string;
  structure: string;
  topic: string;
  duration: number;
  emotion: string;
  intensity: number;
}
