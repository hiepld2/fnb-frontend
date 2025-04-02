import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { QueryClientProvider } from '@tanstack/react-query'
import Keycloak from 'keycloak-js'
import { AuthProvider } from './context/auth/AuthProvider'
import { queryClient } from './utils/queryClient'

import { router } from './routes'

import './assets/styles/fontface.css'
import './assets/styles/tailwind.css'

// Khởi tạo client Keycloak
const keycloakClient = new Keycloak({
  url: 'http://10.14.185.16:5080',
  realm: 'restaurant-realm',
  clientId: 'restaurant-customer',
})

const rootElement = document.getElementById('root')

const initOptions = {
  checkLoginIframe: false,
  pkceMethod: 'S256', // Sử dụng PKCE cho bảo mật
  onLoad: 'check-sso', // Kiểm tra nếu người dùng đã đăng nhập
}

// Xử lý sự kiện từ Keycloak
const handleKeycloakEvent = (event: string, error?: any) => {
  if (event === 'onAuthSuccess') {
    console.log('Đăng nhập thành công')
    // Kiểm tra và lưu token vào localStorage
    if (keycloakClient.token) {
      console.log('Lưu token vào localStorage sau khi đăng nhập thành công')
      localStorage.setItem('keycloak_token', keycloakClient.token)
    }
  }
  if (event === 'onAuthError') {
    console.error('Lỗi xác thực', error)
  }
  if (event === 'onTokenExpired') {
    console.log('Token hết hạn, làm mới token')
    keycloakClient.updateToken(30).then((refreshed: boolean) => {
      if (refreshed) {
        console.log('Token đã được làm mới')
        // Cập nhật token trong localStorage
        if (keycloakClient.token) {
          localStorage.setItem('keycloak_token', keycloakClient.token)
        }
      } else {
        console.log('Token vẫn còn hạn')
      }
    }).catch(() => {
      console.error('Không thể làm mới token')
      keycloakClient.logout()
    })
  }
}

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct."
  )
}

// When you use Strict Mode, React renders each component twice to help you find unexpected side effects.
// @ref: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#react
ReactDOM.createRoot(rootElement).render(
  <ReactKeycloakProvider
    authClient={keycloakClient}
    initOptions={initOptions}
    onEvent={handleKeycloakEvent}
  >
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        {/* Chỉ hiển thị DevTools trong môi trường development */}
      </QueryClientProvider>
    </React.StrictMode>
  </ReactKeycloakProvider>
)
