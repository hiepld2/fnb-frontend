import { QueryClient } from '@tanstack/react-query'

// Tạo instance QueryClient với cấu hình mặc định
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt refetch khi focus lại window
      retry: 1, // Chỉ retry 1 lần khi gặp lỗi
      staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
      gcTime: 10 * 60 * 1000, // Cache data trong 10 phút
    },
    mutations: {
      retry: 1, // Chỉ retry 1 lần khi gặp lỗi
    },
  },
})
