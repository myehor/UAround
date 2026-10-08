import AppLayout from './components/layout/AppLayout/AppLayout'
import HomePage from './pages/HomePage/HomePage'
import EventsPage from './pages/EventsPage/EventsPage'

function App() {
  const pathname = window.location.pathname

  const page =
    pathname === '/events' ? (
      <EventsPage />
    ) : (
      <HomePage />
    )

  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default App