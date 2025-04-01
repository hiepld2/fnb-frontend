import clsx from 'clsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, TextField } from '#/components/ui-react-aria'
import { useKeycloak } from '@react-keycloak/web'

interface ResetPasswordTypes {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ResetPassword() {
  const { keycloak } = useKeycloak()
  const navigate = useNavigate()
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordTypes>()

  const handleResetPassword = async () => {
    try {
      setFailed('')
      setSuccess('')

      if (!keycloak.authenticated) {
        setFailed('Bạn cần đăng nhập để thay đổi mật khẩu!')
        return
      }

      if (newPassword !== confirmPassword) {
        setFailed('Mật khẩu xác nhận không khớp!')
        return
      }

      if (newPassword.length < 8) {
        setFailed('Mật khẩu mới phải có ít nhất 8 ký tự!')
        return
      }

      // Gọi API Keycloak để thay đổi mật khẩu
      const response = await fetch(
        `${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users/${keycloak.tokenParsed?.sub}/reset-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({
            type: 'password',
            value: newPassword,
            temporary: false,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Không thể đổi mật khẩu')
      }

      setSuccess('Mật khẩu đã được thay đổi thành công!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setFailed(`Không thể đổi mật khẩu: ${error.message}`)
    }
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!keycloak.authenticated) {
    return (
      <main className="mx-auto w-full max-w-md p-6">
        <Alert variant="destructive">Bạn cần đăng nhập để thay đổi mật khẩu!</Alert>
        <div className="mt-4 text-center">
          <Link to="/login">
            <Button variant="primary">Đăng nhập</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-md p-6">
      {failed && <Alert variant="destructive">{failed}</Alert>}

      <Card>
        {success && (
          <div className="p-4 sm:px-7 sm:pb-8">
            <Alert variant="success">{success}</Alert>
            <div className="mt-6 grid w-full text-center">
              <Link to="/">
                <Button variant="primary">Quay lại trang chủ &rarr;</Button>
              </Link>
            </div>
          </div>
        )}

        <div className={clsx('p-4 sm:px-7 sm:py-8', success && 'hidden')}>
          <h2 className="text-center text-2xl font-bold mb-6">Đổi mật khẩu</h2>

          <form autoComplete="off" onSubmit={handleSubmit(handleResetPassword)}>
            <div className="grid gap-y-4">
              <TextField
                label="Mật khẩu hiện tại"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                name="currentPassword"
              />

              <TextField
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                name="newPassword"
              />

              <TextField
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                name="confirmPassword"
              />
            </div>
            <div className="mt-6 grid w-full">
              <Button
                type="submit"
                variant="primary"
                isDisabled={isSubmitting}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              <Link to="/" className="text-blue-600 decoration-2 hover:underline">
                &larr; Quay lại trang chủ
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
