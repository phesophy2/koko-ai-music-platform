import type { Artist, ArtistResponse, Project, Song, DashboardStats, CreateProjectRequest } from './types';

const API_BASE = 'http://localhost:8080/v1';

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
    const data = await this.request<ArtistResponse>('/artists');
    return data.artists;
  }

  async getArtist(id: string): Promise<Artist> {
    return this.request<Artist>(`/artists/${id}`);
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getSongs(): Promise<Song[]> {
    return this.request<Song[]>('/songs');
  }

  async getSong(id: string): Promise<Song> {
    return this.request<Song>(`/songs/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/stats');
  }
}

export const api = new KokoAPI();
