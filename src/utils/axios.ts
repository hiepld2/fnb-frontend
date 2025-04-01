import axios, { type AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { KeycloakInstance } from 'keycloak-js'

// Tạo instance axios với cấu hình mặc định
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
export const setupAxiosInterceptors = (keycloak: KeycloakInstance) => {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (keycloak.authenticated) {
        const refreshed = await keycloak.updateToken(60)
        if (refreshed) {
          console.log('Token was refreshed by interceptor')
        }
        const token = keycloak.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config
      // Xử lý lỗi 401 (Unauthorized)
      if (error.response?.status === 401 && originalRequest) {
        try {
          if (keycloak) {
            await keycloak.updateToken(60)
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${keycloak.token}`
              return axiosInstance(originalRequest)
            }
          }
        } catch (refreshError) {
          if (keycloak.authenticated) {
            try {
              localStorage.removeItem('userInfo')
              localStorage.removeItem('keycloak_token')
            } catch (storageError) {
              console.error('Không thể xóa thông tin từ localStorage:', storageError)
            }
            keycloak.logout()
          }
          return Promise.reject(refreshError)
        }
      }

      if (error.response) {
        console.error('Response Error:', error.response.data)
        return Promise.reject(error.response.data)
      }
      if (error.request) {
        console.error('Request Error:', error.request)
        return Promise.reject(error.request)
      }
      console.error('Error:', error.message)
      return Promise.reject(error.message)
    }
  )
}
export default axiosInstance
