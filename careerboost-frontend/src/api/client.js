// API Client for CareerBoost
// Handles all API calls to the backend

const API_BASE_URL = 'http://localhost:5001/api';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Helper method for fetch requests
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Certificates
    async getCertificates(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/certificates?${query}`);
    }

    async searchCertificates(query, level) {
        return this.request(`/certificates/search?q=${query}&level=${level || ''}`);
    }

    async saveCertificate(id) {
        return this.request(`/certificates/${id}/save`, {
            method: 'POST',
        });
    }

    // Internships
    async getInternships(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/internships?${query}`);
    }

    async searchInternships(query) {
        return this.request(`/internships/search?q=${query}`);
    }

    async applyForInternship(id) {
        return this.request(`/internships/${id}/apply`, {
            method: 'POST',
        });
    }

    // Hackathons
    async getHackathons(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/hackathons?${query}`);
    }

    async getUpcomingHackathons() {
        return this.request('/hackathons/upcoming');
    }

    // News
    async getNews(limit = 10) {
        return this.request(`/news?limit=${limit}`);
    }

    async getNewsByCategory(category) {
        return this.request(`/news/category/${category}`);
    }

    async searchNews(query) {
        return this.request(`/news/search?q=${query}`);
    }

    // Tools
    async getTools(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/tools?${query}`);
    }

    async getToolRecommendations(level = 'beginner') {
        return this.request(`/tools/recommendations?level=${level}`);
    }

    // Projects
    async getProjects(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/projects?${query}`);
    }

    async generateProjects(preferences) {
        return this.request('/projects/generate', {
            method: 'POST',
            body: JSON.stringify(preferences),
        });
    }

    // User
    async getProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async getSavedItems(itemType) {
        return this.request(`/users/saved?itemType=${itemType || ''}`);
    }
}

// Export API client instance
const api = new APIClient();
