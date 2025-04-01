import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useAuthentication } from '../../context/auth/AuthProvider'

type UserProfile = {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email: string
  attributes?: Record<string, any>
  dob?: string
  gender?: string
}

export function UserProfile() {
  const { keycloak, initialized } = useKeycloak()
  const { loggedIn, userInfo } = useAuthentication()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        if (initialized && loggedIn && userInfo) {
          // Sử dụng thông tin từ AuthContext
          setProfile({
            id: userInfo.id,
            username: userInfo.username,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            dob: userInfo.dob,
            gender: userInfo.gender,
          })
        } else if (initialized && !loggedIn) {
          // Người dùng chưa đăng nhập
          setError('Bạn cần đăng nhập để xem thông tin tài khoản')
        } else if (initialized && loggedIn && !userInfo) {
          // Đã đăng nhập nhưng không có thông tin người dùng
          setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải thông tin người dùng'
        )
        console.error('Lỗi khi tải thông tin người dùng:', err)
      } finally {
        setLoading(false)
      }
    }

    setupProfile()
  }, [initialized, loggedIn, userInfo])

  if (!loggedIn) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Vui lòng đăng nhập</h2>
          <p className="mt-2 text-gray-600">Bạn cần đăng nhập để xem thông tin tài khoản</p>
          <button
            type="button"
            onClick={() => keycloak.login()}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Thông tin tài khoản</h1>

      {loading && <div className="text-center">Đang tải thông tin...</div>}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {profile && (
        <div className="rounded-lg border bg-white p-6 shadow">
          <div className="mb-6 flex items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600">
              {profile.firstName?.[0] || profile.username?.[0] || '?'}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">
                {profile.firstName && profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.username}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="divide-y">
            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">ID</span>
              <span className="col-span-2 break-all">{profile.id}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">Tên người dùng</span>
              <span className="col-span-2">{profile.username}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">Họ</span>
              <span className="col-span-2">{profile.lastName || '—'}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">Tên</span>
              <span className="col-span-2">{profile.firstName || '—'}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">Email</span>
              <span className="col-span-2">{profile.email}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">Ngày sinh</span>
              <span className="col-span-2">{profile.dob || '—'}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3">
              <span className="font-medium text-gray-500">Giới tính</span>
              <span className="col-span-2">
                {profile.gender === 'male'
                  ? 'Nam'
                  : profile.gender === 'female'
                    ? 'Nữ'
                    : profile.gender || '—'}
              </span>
            </div>

            {profile.attributes &&
              Object.entries(profile.attributes).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 py-3">
                  <span className="font-medium text-gray-500">{key}</span>
                  <span className="col-span-2">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() =>
                window.open(`${keycloak.authServerUrl}/realms/${keycloak.realm}/account`, '_blank')
              }
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Quản lý tài khoản
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
