import { createContext, useContext, useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useApi } from '../../utils/api'

type UserInfo = {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email: string
  fullName: string
  dob?: string
  gender?: string
}

type AuthContext = {
  loggedIn: boolean
  token: string | null
  userInfo: UserInfo | null
  logout: () => void
}

export const DefaultUserContext: AuthContext = {
  loggedIn: false,
  token: null,
  userInfo: null,
  logout: () => {},
}

export const UserContext = createContext(DefaultUserContext)

export function AuthProvider({ children }: React.PropsWithChildren) {
  const { keycloak, initialized } = useKeycloak()
  const [loggedIn, setLoggedIn] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const { get } = useApi()
  // const isFetchingRef = useRef(false)

  useEffect(() => {
    console.log(
      'AuthProvider Effect - Initialized:',
      initialized,
      'Authenticated:',
      keycloak.authenticated
    )
    if (!initialized) {
      return // Chờ Keycloak khởi tạo xong
    }
    setToken(keycloak.token || null)
    if (keycloak.authenticated && keycloak.token) {
      fetchUserInfo()
    } else if (!keycloak.authenticated) {
      setUserInfo(null)
      localStorage.removeItem('userInfo') // Dọn dẹp localStorage
    }
  }, [initialized, keycloak.authenticated, keycloak.token])

  useEffect(() => {
    setLoggedIn(keycloak.authenticated || false)
  }, [keycloak.authenticated])

  const fetchUserInfo = async () => {
    try {
      const userProfileUrl = `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/userinfo`
      const userData = await get(userProfileUrl)
      console.log('AuthProvider - User info fetched:', userData)

      const newUserInfo = {
        id: userData.sub,
        username: userData.preferred_username || userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        fullName:
          userData.name ||
          (userData.given_name && userData.family_name
            ? `${userData.given_name} ${userData.family_name}`
            : userData.preferred_username || userData.email),
        dob: userData.birthdate || userData.dob,
        gender: userData.gender,
      }

      console.log('AuthProvider - Setting new user info:', newUserInfo)
      setUserInfo(newUserInfo)
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
      return newUserInfo
    } catch (error) {
      console.error('AuthProvider - Error fetching user info:', error)
      // Có thể logout nếu lỗi 401
      // if (error?.status === 401) { logout(); }
      throw error
    }
  }

  const logout = () => {
    console.log('AuthProvider logout called')
    try {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('keycloak_token')
    } catch (storageError) {
      console.error('Không thể xóa thông tin từ localStorage:', storageError)
    }
    setUserInfo(null)
    setToken(null)
    setLoggedIn(false)
    // Không cần reset userInfoLoaded
    keycloak.logout()
  }

  return (
    <UserContext.Provider value={{ loggedIn, token, userInfo, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useAuthentication() {
  return useContext(UserContext)
}
