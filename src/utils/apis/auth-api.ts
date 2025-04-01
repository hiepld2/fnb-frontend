import axiosInstance from '../axios'

// Định nghĩa các kiểu dữ liệu
export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// Định nghĩa kiểu dữ liệu cho Menu Item
export interface MenuItem {
  id: number
  parentId: number | null
  to: string | null
  label: string
  appCode: string
  status: number
  ord: number
  type: string
  includeMenu: number
  rights: any[]
  items: MenuItem[]
}

// API calls
export const authApi = {
  // Auth APIs
  auth: {
    login: (credentials: LoginCredentials) =>
      axiosInstance.post('/auth/login', credentials),

    logout: () =>
      axiosInstance.post('/auth/logout'),

    refreshToken: () =>
      axiosInstance.post('/auth/refresh-token'),
  },

  // User APIs
  users: {
    getCurrentUser: () =>
      axiosInstance.get<User>('/users/me'),

    updateProfile: (data: Partial<User>) =>
      axiosInstance.put<User>('/users/me', data),
  },

  // Menu APIs
  menu: {
    getSitemap: (appCode = 'ADMIN') =>
      axiosInstance.get<MenuItem[]>(`/identity-service/api/resource/sitemap?appCode=${appCode}`),
  },

  // Các API khác có thể thêm vào đây
}
