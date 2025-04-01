import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useApi } from '../utils/api'
import { useAuthentication } from '../context/auth/AuthProvider'

interface User {
  id: string
  name: string
  email: string
}

export function ApiExample() {
  const { fetchApi } = useApi()
  const { loggedIn } = useAuthentication()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })

  useEffect(() => {
    // Chỉ tải dữ liệu khi người dùng đã đăng nhập
    if (loggedIn) {
      const fetchUsers = async () => {
        try {
          setLoading(true)
          setError(null)

          // Gọi API với token tự động được thêm vào headers
          const data = await fetchApi('/api/users')
          setUsers(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định')
        } finally {
          setLoading(false)
        }
      }

      fetchUsers()
    }
  }, [loggedIn, fetchApi])

  // Xử lý thêm người dùng mới
  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      setLoading(true)
      setError(null)

      // POST với token tự động được thêm vào
      const createdUser = await fetchApi('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
      })

      setUsers(prev => [...prev, createdUser])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo người dùng mới')
    } finally {
      setLoading(false)
    }
  }

  // Xử lý form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (formData.name.trim() && formData.email.trim()) {
      handleAddUser(formData)
      setFormData({ name: '', email: '' })
    }
  }

  if (!loggedIn) {
    return <div>Vui lòng đăng nhập để xem nội dung này</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>

      {loading && <div className="my-2">Đang tải...</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 rounded my-2">{error}</div>}

      <ul className="divide-y">
        {users.map(user => (
          <li key={user.id} className="py-2">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded">
        <h3 className="text-lg font-medium mb-3">Thêm người dùng mới</h3>
        <div className="mb-3">
          <label htmlFor="user-name" className="block mb-1 text-sm">Tên</label>
          <input
            id="user-name"
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="user-email" className="block mb-1 text-sm">Email</label>
          <input
            id="user-email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Thêm người dùng'}
        </button>
      </form>
    </div>
  )
}
