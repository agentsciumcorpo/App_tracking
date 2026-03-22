import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AuthPage } from '../../pages/AuthPage'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [state, setState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState(user ? 'authenticated' : 'unauthenticated')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session?.user ? 'authenticated' : 'unauthenticated')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    )
  }

  if (state === 'unauthenticated') {
    return <AuthPage />
  }

  return <>{children}</>
}
