// ข้อ 2: NavLink หน้าแรก / Pokédex / ทีม (n/6) · active state ถูกต้อง · จำนวนทีมมาจาก useTeam()
import { NavLink } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'

const linkClass = ({ isActive }) =>
  isActive ? "font-bold text-blue-600 underline" : "text-gray-600"

function Nav() {
  const { count } = useTeam()

  return (
    <nav className="flex gap-4 p-4 border-b">
      <NavLink to="/" end className={linkClass}>หน้าแรก</NavLink>
      <NavLink to="/pokemon" className={linkClass}>Pokédex</NavLink>
      <NavLink to="/team" className={linkClass}>ทีม ({count}/6)</NavLink>
    </nav>
  )
}
export default Nav
