import { memo } from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
  }`

export const NavBar = memo(function NavBar() {
  return (
    <nav className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-900 px-4">
      <NavLink to="/" className={linkClass} end>
        Timer
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        Historique
      </NavLink>
      <NavLink to="/projects" className={linkClass}>
        Projets
      </NavLink>
      <NavLink to="/analysis" className={linkClass}>
        Analyse
      </NavLink>
    </nav>
  )
})
