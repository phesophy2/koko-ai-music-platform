import type {
  BackendArtist, BackendProject, BackendSong, BackendDashboardStats,
  Artist, Project, Song, DashboardStats, CreateProjectRequest
} from './types';

const API_BASE = 'http://localhost:8080/v1';

function toArtist(b: BackendArtist): Artist {
  return {
    id: b.id,
    name: b.name,
    genres: b.genre,
    vibe: b.vibe,
    vocalType: b.vocal_type,
    vocalDNA: {
      timbre: b.vocal_texture[0] || 'Warm',
      range: '',
      emotion: b.vibe[0] || 'Neutral',
      clarity: 85,
      power: 80,
      breathiness: 50,
      resonance: 80,
    },
    brandStatement: b.brand,
    story: b.story,
    influences: b.influences,
    targetAudience: Array.isArray(b.target_audience) ? b.target_audience : [],
  };
}

function toProject(b: BackendProject): Project {
  return {
    id: b.id,
    hexId: b.hex_id,
    name: b.topic,
    status: b.status as Project['status'],
    artistId: b.artist_id,
    artistName: '',
    emotion: b.emotion,
    intensity: b.intensity,
    topic: b.topic,
    createdAt: b.created_at,
  };
}

function toDashboardStats(b: BackendDashboardStats): DashboardStats {
  return {
    totalSongs: b.total_songs,
    totalPlays: b.total_plays,
    totalLikes: b.total_likes,
    credits: b.credits_remaining,
    recentProjects: [],
  };
}

class KokoAPI {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = typeof window !== 'undefined' ? localStorage.getItem('koko_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async getArtists(): Promise<Artist[]> {
    const data = await this.request<BackendArtist[]>('/artists');
    return data.map(toArtist);
  }

  async getArtist(id: string): Promise<Artist> {
    const data = await this.request<BackendArtist>(`/artists/${id}`);
    return toArtist(data);
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const result = await this.request<BackendProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return toProject(result);
  }

  async getProjects(): Promise<Project[]> {
    const data = await this.request<BackendProject[]>('/projects');
    return data.map(toProject);
  }

  async getSongs(): Promise<Song[]> {
    return this.request<Song[]>('/songs');
  }

  async getSong(id: string): Promise<Song> {
    return this.request<Song>(`/songs/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const data = await this.request<BackendDashboardStats>('/dashboard/stats');
    return toDashboardStats(data);
  }
}

export const api = new KokoAPI();
