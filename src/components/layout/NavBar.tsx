import { memo, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
  }`

export const NavBar = memo(function NavBar() {
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <nav className="flex items-center border-b border-zinc-800 bg-zinc-900 px-4">
      <div className="flex flex-1 items-center gap-1">
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
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-red-400"
      >
        Déconnexion
      </button>
    </nav>
  )
})
