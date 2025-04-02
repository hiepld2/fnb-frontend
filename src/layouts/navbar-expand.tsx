import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthentication } from '../context/auth/AuthProvider'
import { useSitemap } from '../utils/hooks/auth-hooks'
import type { MenuItem } from '../utils/apis/auth-api'

// Component để render một menu item
const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && item.items.length > 0

  const toggleSubMenu = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="w-full">
      {item.to ? (
        // Menu item có đường dẫn
        <Link
          to={item.to}
          className="mt-2 flex h-12 w-full items-center rounded px-3 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <span className="ml-2 font-medium text-sm">{item.label}</span>
        </Link>
      ) : (
        // Menu item là nhóm (có children)
        <div className="w-full">
          <button
            type="button"
            onClick={toggleSubMenu}
            className="mt-2 flex h-12 w-full items-center rounded px-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <span className="ml-2 font-medium text-sm">{item.label}</span>
            {hasChildren && (
              <svg
                className={`ml-auto h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Submenu */}
          {isOpen && hasChildren && (
            <div className="ml-4 border-l border-gray-300 dark:border-gray-700">
              {item.items.map((subItem) => (
                <MenuItemComponent key={subItem.id} item={subItem} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface NavBarExpandProps {
  onToggle?: () => void
}

export function NavBarExpand({ onToggle }: NavBarExpandProps) {
  const { userInfo, logout } = useAuthentication()
  const { data: menuData, isLoading, error } = useSitemap()

  return (
    <div className="flex h-full min-h-screen w-56 flex-col items-center overflow-hidden rounded-r bg-white text-gray-600 shadow-md dark:border-gray-900 dark:border-r dark:bg-gray-900 dark:text-gray-400">
      <div className="mt-3 flex w-full items-center justify-between px-3">
        <div className="flex items-center">
          <svg
            className="h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
          <span className="ml-2 font-bold text-sm">Restaurant App</span>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Thu gọn menu"
        >
          <svg
            className="h-5 w-5 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="w-full px-2 flex-1 overflow-y-auto">
        {/* Menu từ API */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-2 text-red-500 text-center">
            Không thể tải menu. Vui lòng thử lại sau.
          </div>
        )}

        {menuData && menuData.length > 0 && (
          <div className="mt-4">
            {menuData.map((menuGroup) => (
              <div key={menuGroup.id} className="mt-2">
                {menuGroup.items.map((item) => (
                  <MenuItemComponent key={item.id} item={item} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto w-full px-2">
        <div className="mt-3 flex w-full flex-col items-center border-gray-200 border-t dark:border-gray-700">
          <Link
            className="mt-2 flex h-12 w-full items-center rounded px-3 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            to="/user-profile"
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
            <span className='ml-2 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
              {userInfo ? userInfo.fullName : 'Tài khoản'}
            </span>
          </Link>
        </div>
      </div>

      <div className='mb-2 w-full px-2'>
        <button
          onClick={logout}
          className="mt-2 flex h-12 w-full items-center rounded px-3 text-left hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
          type="button"
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
          <span className="ml-2 font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
