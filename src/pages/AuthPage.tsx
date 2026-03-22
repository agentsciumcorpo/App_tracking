import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'signup'

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) {
          setError(signUpError.message)
          return
        }
        setConfirmationSent(true)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError(
            signInError.message === 'Invalid login credentials'
              ? 'Email ou mot de passe incorrect'
              : signInError.message,
          )
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (confirmationSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-900 px-4">
        <h1 className="text-2xl font-bold text-zinc-100">Vérifiez votre email</h1>
        <p className="max-w-sm text-center text-zinc-400">
          Un email de confirmation a été envoyé à <span className="text-zinc-200">{email}</span>.
          Cliquez sur le lien pour activer votre compte.
        </p>
        <button
          onClick={() => { setConfirmationSent(false); setMode('login') }}
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          Retour à la connexion
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-900 px-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-zinc-100">Productivity Tracker</h1>
        <p className="text-sm text-zinc-400">
          {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <p className="text-sm text-zinc-500">
        {mode === 'login' ? "Pas encore de compte ? " : 'Déjà un compte ? '}
        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
          className="text-emerald-400 hover:text-emerald-300"
        >
          {mode === 'login' ? "S'inscrire" : 'Se connecter'}
        </button>
      </p>
    </div>
  )
}
