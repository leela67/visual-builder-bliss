import { API_BASE_URL } from './config';

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface RegisterRequest {
  phone_number: string;
  password: string;
  name: string;
  interests: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      phone_number: string;
      name: string;
      interests: string[];
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
  error_code?: string;
  details?: any;
}

export interface User {
  id: number;
  phone_number: string;
  name: string;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'currentUser';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';

  // Token management
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Set expiry to 10 days from now (as per API documentation)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryDate.toISOString());
  }

  static getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return null;
    }

    // Check if token is expired
    if (new Date() > new Date(expiry)) {
      this.clearAuth();
      return null;
    }

    return token;
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // API calls
  static async login(phoneNumber: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password,
        }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        error_code: 'NETWORK_ERROR',
      };
    }
  }

  static async register(phoneNumber: string, password: string, name: string, interests: string[]): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password,
          name: name,
          interests: interests,
        }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
      }

      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        error_code: 'NETWORK_ERROR',
      };
    }
  }

  static async getUserProfile(): Promise<{ success: boolean; data?: User; message: string }> {
    const token = this.getToken();
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        this.setUser(data.data);
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
      };
    }
  }

  static async updateUserProfile(name: string, interests: string[]): Promise<{ success: boolean; data?: User; message: string }> {
    const token = this.getToken();
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          interests: interests,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        this.setUser(data.data);
      }

      return data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
      };
    }
  }

  static logout(): void {
    this.clearAuth();
  }

  // Helper method to get authorization headers
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}
