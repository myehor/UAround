import AppLayout from './components/layout/AppLayout/AppLayout'
import HomePage from './pages/HomePage/HomePage'
import EventsPage from './pages/EventsPage/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage'

function App() {
  const pathname = window.location.pathname

  const eventDetailsMatch =
    pathname.match(/^\/events\/([^/]+)$/)

  const renderPage = () => {
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

    return <HomePage />
  }

  return <AppLayout>{renderPage()}</AppLayout>
}

export default App