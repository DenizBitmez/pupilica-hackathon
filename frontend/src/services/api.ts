// API configuration
const API_BASE_URL = 'http://localhost:5001';

// API service class
export class ApiService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Authentication endpoints
  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  }

  static async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  }

  static async getProfile() {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  static async updateProfile(updates: any) {
    const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    return response.json();
  }

  // Chat endpoints
  static async sendMessage(figureId: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ figure_id: figureId, message }),
    });

    return response.json();
  }

  // Progress tracking endpoints
  static async getProgress(figureId: string) {
    const response = await fetch(`${API_BASE_URL}/api/progress/${figureId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  static async updateProgress(figureId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/api/progress/${figureId}/update`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return response.json();
  }

  // Utility methods
  static async checkConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default ApiService;

