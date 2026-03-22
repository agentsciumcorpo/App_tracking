import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { PROJECT_COLOR_LIST } from '../lib/utils'
import { mapSupabaseError } from '../lib/errors'
import type { Project, ProjectColor } from '../types'

export interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  createProject: (name: string, color: ProjectColor) => Promise<boolean>
  updateProject: (id: string, name: string, color: ProjectColor) => Promise<boolean>
  deleteProject: (id: string) => Promise<boolean>
  refresh: () => Promise<void>
}

const MAX_NAME_LENGTH = 100

function userFriendlyError(raw: string): string {
  return mapSupabaseError('useProjects', raw, {
    'violates foreign key constraint': 'Ce projet a des tâches associées. Réassignez-les avant de le supprimer.',
  })
}

function isValidColor(color: string): color is ProjectColor {
  return PROJECT_COLOR_LIST.includes(color as ProjectColor)
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userIdRef = useRef<string | null>(null)

  const fetchProjects = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(userFriendlyError(fetchError.message))
      return
    }

    setProjects((data ?? []) as Project[])
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) userIdRef.current = user.id
      await fetchProjects()
      setLoading(false)
    }
    init()
  }, [fetchProjects])

  const createProject = useCallback(async (name: string, color: ProjectColor): Promise<boolean> => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Le nom du projet est requis')
      return false
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError(`Le nom ne peut pas dépasser ${MAX_NAME_LENGTH} caractères`)
      return false
    }
    if (!isValidColor(color)) {
      setError('Couleur invalide')
      return false
    }
    if (!userIdRef.current) {
      setError('Session expirée, veuillez vous reconnecter.')
      return false
    }

    setError(null)

    const { data, error: insertError } = await supabase
      .from('projects')
      .insert({ name: trimmed, color, user_id: userIdRef.current })
      .select()
      .single()

    if (insertError) {
      setError(userFriendlyError(insertError.message))
      return false
    }

    setProjects((prev) => [...prev, data as Project])
    return true
  }, [])

  const updateProject = useCallback(async (id: string, name: string, color: ProjectColor): Promise<boolean> => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Le nom du projet est requis')
      return false
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError(`Le nom ne peut pas dépasser ${MAX_NAME_LENGTH} caractères`)
      return false
    }
    if (!isValidColor(color)) {
      setError('Couleur invalide')
      return false
    }

    setError(null)
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, name: trimmed, color } : p))

    const { error: updateError } = await supabase
      .from('projects')
      .update({ name: trimmed, color })
      .eq('id', id)

    if (updateError) {
      setError(userFriendlyError(updateError.message))
      await fetchProjects()
      return false
    }

    return true
  }, [fetchProjects])

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    setError(null)
    setProjects((prev) => prev.filter((p) => p.id !== id))

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(userFriendlyError(deleteError.message))
      await fetchProjects()
      return false
    }

    return true
  }, [fetchProjects])

  return { projects, loading, error, createProject, updateProject, deleteProject, refresh: fetchProjects }
}
