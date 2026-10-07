import type { ReactNode } from 'react'
import Header from '../Header/Header'
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
    </div>
  )
}

export default AppLayout