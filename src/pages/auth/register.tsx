import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, TextField } from '#/components/ui-react-aria'
import { useKeycloak } from '@react-keycloak/web'

interface RegisterTypes {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  password: string
}

export default function Register() {
  const { keycloak } = useKeycloak()
  const navigate = useNavigate()
  const [failed, setFailed] = useState<string | null>()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterTypes>()

  const handleRegister = async () => {
    try {
      setFailed(null)

      // Đăng ký user mới trong Keycloak
      const response = await fetch(`${keycloak.authServerUrl}/admin/realms/${keycloak.realm}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          username: email,
          email: email,
          firstName: firstName,
          lastName: lastName,
          enabled: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
          attributes: {
            dateOfBirth: [dateOfBirth],
            gender: [gender],
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Đăng ký thất bại')
      }

      // Chuyển hướng đến trang đăng nhập của Keycloak
      await keycloak.login()
      navigate('/')
    } catch (error: any) {
      setFailed(error.message)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-6">
      {failed && <Alert variant="destructive">{failed}</Alert>}

      <Card>
        <div className="p-4 sm:px-7 sm:py-8">
          <h2 className="text-center text-2xl font-bold mb-6">Đăng ký tài khoản</h2>

          <form autoComplete="off" onSubmit={handleSubmit(handleRegister)}>
            <div className="grid gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Họ"
                  value={firstName}
                  onChange={setFirstName}
                  name="firstName"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}

                <TextField
                  label="Tên"
                  value={lastName}
                  onChange={setLastName}
                  name="lastName"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <TextField
                label="Ngày sinh"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                name="dateOfBirth"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giới tính
                </label>
                <select
                  id="gender"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                name="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}

              <TextField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={setPassword}
                name="password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="mt-6 grid w-full">
              <Button
                type="submit"
                variant="primary"
                isDisabled={isSubmitting}
              >
                Đăng ký
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 decoration-2 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
