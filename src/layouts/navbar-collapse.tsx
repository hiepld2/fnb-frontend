import { useAuthentication } from '../context/auth/AuthProvider'
import { useSitemap } from '../utils/hooks/auth-hooks'
import { Link } from 'react-router-dom'
import type { MenuItem } from '../utils/apis/auth-api'

interface NavBarCollapseProps {
  onToggle?: () => void
}

// Component để render một menu item thu gọn
const CollapsedMenuItem = ({ item }: { item: MenuItem }) => {
  // Chỉ hiển thị các menu cấp 1 trong chế độ thu gọn
  return (
    <Link
      to={item.to || '#'}
      className="mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      title={item.label}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
        <span className="text-xs font-medium">{item.label.charAt(0)}</span>
      </div>
    </Link>
  )
}

export function NavBarCollapse({ onToggle }: NavBarCollapseProps) {
  const { userInfo, logout } = useAuthentication()
  const { data: menuData, isLoading, error } = useSitemap()

  return (
    <div className="flex h-full min-h-screen w-16 flex-col items-center overflow-hidden rounded-r bg-white text-gray-700 shadow-sm dark:border-gray-800 dark:border-r dark:bg-gray-900 dark:text-gray-400">
      <div className="mt-3 flex w-full items-center justify-center px-3">
        <svg
          className="h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className="mt-2 flex h-8 w-8 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        title="Mở rộng menu"
      >
        <svg
          className="h-5 w-5 stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>

      <div className="mt-3 flex-1 overflow-y-auto">
        {/* Menu từ API */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-2 text-red-500 text-center">
            <span className="text-xs">Lỗi</span>
          </div>
        )}

        {menuData && menuData.length > 0 && (
          <div className="flex flex-col items-center">
            {menuData.map((menuGroup) => (
              <div key={menuGroup.id} className="w-full">
                {menuGroup.items.map((item) => (
                  <CollapsedMenuItem key={item.id} item={item} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center">
        {/* User profile link */}
        <Link
          to="/user-profile"
          className="flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          title={userInfo?.fullName || 'Tài khoản'}
        >
          <svg
            className="h-6 w-6 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>

        {/* Logout button */}
        <button
          onClick={logout}
          className="mb-2 mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
          type="button"
          title="Đăng xuất"
        >
          <svg
            className="h-6 w-6 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
