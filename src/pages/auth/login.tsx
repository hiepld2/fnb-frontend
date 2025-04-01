import { useState, useEffect } from 'react'
import { Alert, Button, Card } from '#/components/ui-react-aria'
import { useKeycloak } from '@react-keycloak/web'
import { useAuthentication } from '#/context/auth/AuthProvider'

export default function Login() {
  const { keycloak } = useKeycloak()
  const { logout } = useAuthentication()
  const [failed, setFailed] = useState<string | null>()
  const [isLoading, setIsLoading] = useState(false)

  // Clear localStorage và context khi trang login được mở
  useEffect(() => {
    // Nếu người dùng đang đăng nhập, thực hiện logout để clear context
    if (keycloak.authenticated) {
      console.log('Đang ở trang login, thực hiện clear context và localStorage')
      logout()
    } else {
      // Nếu không, chỉ xóa localStorage để đảm bảo không còn dữ liệu đăng nhập cũ
      localStorage.removeItem('userInfo')
      localStorage.removeItem('keycloak_token')
      console.log('Đã xóa dữ liệu đăng nhập cũ trong localStorage')
    }
  }, [keycloak.authenticated, logout])

  const handleLogin = async () => {
    try {
      setFailed(null)
      setIsLoading(true)

      // Lưu đường dẫn chuyển hướng sau khi đăng nhập
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard/overview'

      // Sử dụng luồng chuẩn của Keycloak (Authorization Code Flow + PKCE)
      await keycloak.login({
        redirectUri: `${window.location.origin}${redirectPath}`,
      })

      // Lưu ý: Sau khi gọi keycloak.login(), trang sẽ được chuyển hướng đến Keycloak
      // và sẽ không thực thi mã bên dưới cho đến khi quay lại sau khi xác thực
      console.log('Quay lại sau khi xác thực Keycloak')

    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error)
      setFailed('Đăng nhập thất bại. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-6">
      {failed && <Alert variant="destructive">{failed}</Alert>}

      <Card>
        <div className="p-4 sm:px-7 sm:py-8">
          <h2 className="text-center text-2xl font-bold mb-6">Đăng nhập</h2>

          <div className="mt-6 grid gap-4">
            <Button
              type="button"
              variant="primary"
              isDisabled={isLoading}
              onPress={handleLogin}
            >
              {isLoading ? 'Đang chuyển hướng...' : 'Đăng nhập với tài khoản'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onPress={() => keycloak.register()}
            >
              Đăng ký tài khoản mới
            </Button>
          </div>
        </div>
      </Card>
    </main>
  )
}
