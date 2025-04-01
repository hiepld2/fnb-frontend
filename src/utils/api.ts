import { useAuthentication } from '../context/auth/AuthProvider'
import { useKeycloak } from '@react-keycloak/web'

interface FetchOptions extends RequestInit {
  authRequired?: boolean
  data?: any
  params?: Record<string, string>
}

interface ApiError extends Error {
  status?: number
  data?: any
}

/**
 * Hook để tương tác với API bao gồm xác thực và refresh token
 */
export const useApi = () => {
  const { token } = useAuthentication()
  const { keycloak } = useKeycloak()

  /**
   * Làm mới token khi hết hạn
   * @returns Promise với token mới hoặc null nếu thất bại
   */
  const refreshToken = async (): Promise<string | null> => {
    try {
      console.log('Đang làm mới token...')

      // Kiểm tra và sử dụng refresh token từ Keycloak
      if (!keycloak.refreshToken) {
        console.error('Không có refresh token')
        throw new Error('Không có refresh token để làm mới')
      }

      const refreshTokenUrl = `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`

      const formData = new URLSearchParams()
      formData.append('client_id', 'restaurant-app')
      formData.append('grant_type', 'refresh_token')
      formData.append('refresh_token', keycloak.refreshToken)
      formData.append('scope', 'openid profile email')

      const response = await fetch(refreshTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Không thể làm mới token')
      }

      const tokenData = await response.json()

      // Cập nhật token trong Keycloak
      keycloak.token = tokenData.access_token
      keycloak.refreshToken = tokenData.refresh_token
      keycloak.idToken = tokenData.id_token

      // Lưu token mới vào localStorage
      localStorage.setItem('keycloak_token', tokenData.access_token)

      console.log('Token đã được làm mới thành công')
      return tokenData.access_token
    } catch (error) {
      console.error('Lỗi khi làm mới token:', error)
      // Đăng xuất nếu không thể làm mới token
      keycloak.logout()
      return null
    }
  }

  /**
   * Xử lý request API với xác thực và refresh token
   */
  const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<any> => {
    const { authRequired = true, params, ...fetchOptions } = options

    // Xử lý tham số query
    let finalUrl = url
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString()
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
    }

    // Chuẩn bị headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    }

    // Lấy token từ localStorage hoặc từ context
    const currentToken = localStorage.getItem('keycloak_token') || token

    // Thêm token xác thực nếu yêu cầu và token tồn tại
    if (authRequired && currentToken) {
      if (headers instanceof Headers) {
        headers.set('Authorization', `Bearer ${currentToken}`);
      } else if (Array.isArray(headers)) {
        headers.push(['Authorization', `Bearer ${currentToken}`]);
      } else {
        // Nếu headers là một object đơn giản
        (headers as Record<string, string>).Authorization = `Bearer ${currentToken}`;
      }
    }

    try {
      // Thực hiện request
      const response = await fetch(finalUrl, {
        ...fetchOptions,
        headers,
      })

      // Nếu token hết hạn (401), thử làm mới token và gọi lại API
      if (response.status === 401 && authRequired) {
        const newToken = await refreshToken()

        if (newToken) {
          // Cập nhật token trong header
          if (headers instanceof Headers) {
            headers.set('Authorization', `Bearer ${newToken}`);
          } else if (Array.isArray(headers)) {
            const authIndex = headers.findIndex(h => h[0] === 'Authorization')
            if (authIndex >= 0) {
              headers[authIndex] = ['Authorization', `Bearer ${newToken}`]
            } else {
              headers.push(['Authorization', `Bearer ${newToken}`])
            }
          } else {
            (headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
          }

          // Thử request lại với token mới
          const newResponse = await fetch(finalUrl, {
            ...fetchOptions,
            headers,
          })

          if (newResponse.ok) {
            // Trả về dữ liệu nếu request thành công
            const contentType = newResponse.headers.get('content-type')
            if (contentType?.includes('application/json')) {
              return newResponse.json()
            }
            return newResponse
          }

          // Xử lý lỗi nếu request vẫn thất bại
          const error = await newResponse.json().catch(() => ({
            message: 'Đã xảy ra lỗi khi kết nối đến máy chủ',
          }))

          const apiError = new Error(error.message || `Lỗi ${newResponse.status}: ${newResponse.statusText}`) as ApiError
          apiError.status = newResponse.status
          apiError.data = error
          throw apiError
        }

        // Không thể làm mới token
        const apiError = new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại') as ApiError
        apiError.status = 401
        throw apiError
      }

      // Kiểm tra lỗi nếu request ban đầu thất bại
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Đã xảy ra lỗi khi kết nối đến máy chủ',
        }))

        const apiError = new Error(error.message || `Lỗi ${response.status}: ${response.statusText}`) as ApiError
        apiError.status = response.status
        apiError.data = error
        throw apiError
      }

      // Trả về dữ liệu JSON nếu có
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return response.json()
      }

      return response
    } catch (error) {
      console.error('Lỗi khi gọi API:', error)
      throw error
    }
  }

  /**
   * GET request
   */
  const get = (url: string, options: FetchOptions = {}) => {
    return fetchWithAuth(url, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  const post = (url: string, data: any, options: FetchOptions = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  const put = (url: string, data: any, options: FetchOptions = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  const patch = (url: string, data: any, options: FetchOptions = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  const del = (url: string, options: FetchOptions = {}) => {
    return fetchWithAuth(url, { ...options, method: 'DELETE' })
  }

  return {
    fetchApi: fetchWithAuth,
    get,
    post,
    put,
    patch,
    del,
    refreshToken
  }
}
