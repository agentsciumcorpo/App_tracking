import { logError } from './utils'

export function mapSupabaseError(
  context: string,
  raw: string,
  overrides?: Record<string, string>,
): string {
  logError(`[${context}]`, raw)
  if (overrides) {
    for (const [key, msg] of Object.entries(overrides)) {
      if (raw.includes(key)) return msg
    }
  }
  return 'Une erreur est survenue, veuillez réessayer.'
}
