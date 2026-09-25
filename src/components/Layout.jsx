// ข้อ 2: layout route — <Nav /> + <Outlet /> + footer
import Nav from './Nav.jsx'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <footer className="p-4 border-t text-sm">© 2026 DII CAMT</footer>
    </div>
  )
}
export default Layout
