
import type { ReactNode } from 'react'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import HelpFeedback from '../../feedback/HelpFeedback/HelpFeedback'

import './AppLayout.scss'

type AppLayoutProps = {
  children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Header />

      <main className="app-layout__main">
        {children}
      </main>

      <Footer />

      <HelpFeedback />
    </div>
  )
}

export default AppLayout
