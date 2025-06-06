// Serwis API dla zarządzania profilami użytkowników
import { UserProfile, ProfileStatus, Gender } from "@shared-types/UserProfile";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ProfileFilters {
  search?: string;
  status?: ProfileStatus;
  gender?: Gender;
  city?: string;
  ageMin?: number;
  ageMax?: number;
  hasPhoto?: boolean;
  page?: number;
  limit?: number;
}

export interface ProfilesResponse {
  profiles: UserProfile[];
  total: number;
  page: number;
  totalPages: number;
}

class ProfilesApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Pobierz listę profili z filtrowaniem i paginacją
  async getProfiles(filters: ProfileFilters = {}): Promise<ProfilesResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.fetchApi<ProfilesResponse>(`/profiles?${params.toString()}`);
  }

  // Pobierz statystyki dashboard
  async getDashboardStats() {
    return this.fetchApi<any>('/profiles/stats');
  }

  // Generuj nowe profile
  async generateProfiles(count: number, options?: any) {
    return this.fetchApi<{ success: boolean; generated: number }>('/profiles/generate', {
      method: 'POST',
      body: JSON.stringify({ count, options }),
    });
  }

  // Usuń profil
  async deleteProfile(profileId: string): Promise<{ success: boolean }> {
    return this.fetchApi<{ success: boolean }>(`/profiles/${profileId}`, {
      method: 'DELETE',
    });
  }

  // Usuń wiele profili
  async deleteMultipleProfiles(profileIds: string[]): Promise<{ success: boolean; deleted: number }> {
    return this.fetchApi<{ success: boolean; deleted: number }>('/profiles/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ profileIds }),
    });
  }

  // Pobierz profil po ID
  async getProfile(profileId: string): Promise<UserProfile> {
    return this.fetchApi<UserProfile>(`/profiles/${profileId}`);
  }

  // Aktualizuj profil
  async updateProfile(profileId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.fetchApi<UserProfile>(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

export const profilesApi = new ProfilesApiService();
