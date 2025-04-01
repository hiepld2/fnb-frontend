import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Alert, Button, Card, TextField } from '#/components/ui-react-aria'
import { useKeycloak } from '@react-keycloak/web'

interface PasswordRecoveryTypes {
  email: string
}

export default function Recovery() {
  const { keycloak } = useKeycloak()
  const [success, setSuccess] = useState<string | null>()
  const [failed, setFailed] = useState<string | null>()
  const [email, setEmail] = useState('')

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PasswordRecoveryTypes>()

  const handleRecoveryPassword = async () => {
    try {
      setFailed(null)
      setSuccess(null)

      // Trong Keycloak, việc khôi phục mật khẩu thường được xử lý bằng cách chuyển hướng đến
      // trang khôi phục mật khẩu của Keycloak
      await keycloak.login({
        action: 'UPDATE_PASSWORD'
      })

      setSuccess('Yêu cầu khôi phục mật khẩu đã được gửi, vui lòng kiểm tra email của bạn.')
    } catch (error: any) {
      setFailed(`Không thể yêu cầu khôi phục mật khẩu: ${error.message}`)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-6">
      {success && <Alert variant="success">{success}</Alert>}
      {failed && <Alert variant="destructive">{failed}</Alert>}

      <Card>
        <div className="p-4 sm:px-7 sm:py-8">
          <h2 className="text-center text-2xl font-bold mb-6">Khôi phục mật khẩu</h2>

          <form autoComplete="off" onSubmit={handleSubmit(handleRecoveryPassword)}>
            <div className="grid gap-y-4">
              <div>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  name="email"
                />
              </div>
            </div>
            <div className="mt-6 grid w-full">
              <Button
                type="submit"
                variant="primary"
                isDisabled={isSubmitting}
              >
                Khôi phục mật khẩu
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {'Đã nhớ mật khẩu? '}
              <Link to="/login" className="text-blue-600 decoration-2 hover:underline">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
