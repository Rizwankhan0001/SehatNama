const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getDoctors(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/doctors?${queryString}`);
  }

  async getDoctor(id: string) {
    return this.request(`/doctors/${id}`);
  }

  async getSpecialties() {
    return this.request('/doctors/specialties');
  }

  async login(email: string, password: string, userType: string = 'patient') {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType })
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async sendOTP(phone: string, userType: string) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, userType })
    });
  }

  async verifyOTP(phone: string, otp: string, userType: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, userType })
    });
  }

  async bookAppointment(appointmentData: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }

  async getUserAppointments(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/appointments?${queryString}`);
  }

  async getAvailableSlots(doctorId: string, date: string) {
    return this.request(`/appointments/slots?doctorId=${doctorId}&date=${date}`);
  }

  async cancelAppointment(appointmentId: string) {
    return this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'PUT'
    });
  }

  async getUserProfile() {
    return this.request('/auth/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
}

export default new ApiService();