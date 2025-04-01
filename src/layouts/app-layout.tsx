import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { SideNavbar } from './sidebar'

export function AppLayout() {
  const { initialized, keycloak } = useKeycloak()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600' />
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </div>
    )
  }

  if (!keycloak.authenticated) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/login" replace />
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <main className="flex h-full min-h-screen bg-gray-100 dark:bg-slate-900">
      <SideNavbar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </main>
  )
}
