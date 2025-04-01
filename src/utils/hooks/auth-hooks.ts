import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../apis/auth-api'
import type { User, LoginCredentials, } from '../apis/auth-api'
import { mockMenuData } from '../mockData'

// Query hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => authApi.users.getCurrentUser().then(res => res.data),
    enabled: true, // Chỉ query khi component mount
  })
}

// Hook để lấy menu
export function useSitemap(appCode = 'ADMIN') {
  return useQuery({
    queryKey: ['menu', 'sitemap', appCode],
    // queryFn: () => api.menu.getSitemap(appCode).then(res => res.data),
    queryFn: async () => {
      console.log('Sử dụng dữ liệu mẫu cho menu')
      // Giả lập delay của mạng
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockMenuData
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu menu không thay đổi thường xuyên
  })
}

// Mutation hooks
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApi.auth.login(credentials).then(res => res.data),

    onSuccess: () => {
      // Invalidate và refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.auth.logout(),

    onSuccess: () => {
      // Xóa tất cả queries khi logout
      queryClient.clear()
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) =>
      authApi.users.updateProfile(data).then(res => res.data),

    onSuccess: () => {
      // Invalidate và refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
