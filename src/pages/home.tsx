import { Link } from 'react-router-dom'
import { ThemeSwitcher } from '#/components/theme'
import { Alert, Button } from '#/components/ui-react-aria'
import { useAuthentication } from '#/context/auth/AuthProvider'

// Assets in public directory cannot be imported from JavaScript.
// Instead, we use `src/assets` directory.
import ViteLogo from '../assets/images/vite.svg'
import { useKeycloak } from '@react-keycloak/web'

export default function Home() {
  const { userInfo } = useAuthentication()
  const { keycloak } = useKeycloak()

  return (
    <div className="mx-auto flex h-full min-h-screen w-full flex-col">
      <header className="mb-auto w-full p-4" aria-hidden>
        <ThemeSwitcher className="float-right size-9" />
      </header>
      <div className="mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full border-collapse items-center justify-center">
          <img src={ViteLogo} alt="Vite logo" className="h-28" />
        </div>
        <div className="text-center text-gray-600 text-lg sm:mt-8 dark:text-gray-400">
          <p className="leading-8">This is an example starter template React with Vite.</p>
          <p className="leading-8">
            Vite + React + Typescript + Tailwind CSS + React Hook Form + Vitest
          </p>
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <Link to="/overview" className="inline-flex items-center justify-center">
            <Button variant="primary">User Dashboard</Button>
          </Link>
          <Link to="/admin" className="inline-flex items-center justify-center">
            <Button variant="destructive">Admin Dashboard</Button>
          </Link>
        </div>
        <div>
          <Alert
            variant={keycloak.authenticated ? 'info' : 'warning'}
            className="w-full text-center"
          >
            {keycloak.authenticated
              ? `Welcome back ${userInfo?.fullName} 👋`
              : 'You are not logged in! '}
            {!keycloak.authenticated && (
              <Button variant="primary" onPress={() => keycloak.login()}>
                Login
              </Button>
            )}
          </Alert>
        </div>
      </div>
      <footer className="mt-auto py-5 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-sm tracking-wide dark:text-gray-400">
            &copy; {new Date().getFullYear()} - Made by{' '}
            <Link to="https://github.com/hiepld2" className="hover:underline">
              HiepLD2
            </Link>{' '}
          </p>
          <p className="mt-2 text-gray-600 text-sm tracking-wide dark:text-gray-400">
            v{import.meta.env.APP_VERSION}
          </p>
        </div>
      </footer>
    </div>
  )
}
