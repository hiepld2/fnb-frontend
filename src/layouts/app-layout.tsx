import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { SideNavbar } from './sidebar'

export function AppLayout() {
  const { initialized, keycloak } = useKeycloak()
  const location = useLocation()

  // Trạng thái đang tải khi Keycloak chưa khởi tạo xong
  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto" />
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </div>
    )
  }

  // Nếu Keycloak đã khởi tạo XONG và báo KHÔNG authenticated -> chuyển hướng
  if (!keycloak.authenticated) {
    console.log('AppLayout: Not authenticated, redirecting to login. Saving path:', location.pathname)
    // Lưu URL hiện tại để chuyển hướng sau khi đăng nhập
    sessionStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/login" replace />
  }

  // Khi đã đăng nhập (initialized là true và authenticated là true)
  console.log('AppLayout: Authenticated, rendering layout.')
  return (
    <main className="flex h-full min-h-screen bg-gray-100 dark:bg-slate-900">
      <SideNavbar collapsed={false} />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </main>
  )
}
