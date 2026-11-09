
import AppLayout from './components/layout/AppLayout/AppLayout'
import EmailConfirmationPage from './components/auth/EmailConfirmationPage/EmailConfirmationPage'
import EmailConfirmedPage from './components/auth/EmailConfirmedPage/EmailConfirmedPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage/ForgotPasswordPage'
import LoginPage from './components/auth/LoginPage/LoginPage'
import RegisterPage from './components/auth/RegisterPage/RegisterPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage/ResetPasswordPage'
import CreateEventPage from './pages/CreateEventPage/CreateEventPage'
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage'
import EventsPage from './pages/EventsPage/EventsPage'
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import WelcomePage from './pages/WelcomePage/WelcomePage'

function App() {
  const pathname = window.location.pathname

  const eventDetailsMatch = pathname.match(
    /^\/events\/([^/]+)$/,
  )

  const renderPage = () => {
    if (pathname === '/') {
      return <WelcomePage />
    }

    if (pathname === '/home') {
      return <HomePage />
    }

    if (pathname === '/register') {
      return <RegisterPage />
    }

    if (pathname === '/login') {
      return <LoginPage />
    }

    if (pathname === '/email-confirmation') {
      return <EmailConfirmationPage />
    }

    if (pathname === '/email-confirmed') {
      return <EmailConfirmedPage />
    }

    if (pathname === '/forgot-password') {
      return <ForgotPasswordPage />
    }

    if (pathname === '/reset-password') {
      return <ResetPasswordPage />
    }

    if (pathname === '/events/create') {
      return <CreateEventPage />
    }

    if (eventDetailsMatch) {
      return (
        <EventDetailsPage
          eventId={eventDetailsMatch[1]}
        />
      )
    }

    if (pathname === '/events') {
      return <EventsPage />
    }

    if (pathname === '/profile') {
      return <ProfilePage />
    }

    return <HomePage />
  }

  const isWelcomePage = pathname === '/'

  const isAuthPage =
    pathname === '/register' ||
    pathname === '/login' ||
    pathname === '/email-confirmation' ||
    pathname === '/email-confirmed' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  if (isWelcomePage || isAuthPage) {
    return renderPage()
  }

  return (
    <AppLayout>
      {renderPage()}
    </AppLayout>
  )
}

export default App
