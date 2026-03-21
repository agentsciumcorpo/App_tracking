import { createContext, useContext } from 'react'
import { useProjects } from '../hooks/useProjects'
import type { UseProjectsReturn } from '../hooks/useProjects'

const ProjectsContext = createContext<UseProjectsReturn | null>(null)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const value = useProjects()
  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjectsContext(): UseProjectsReturn {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjectsContext must be used within ProjectsProvider')
  return ctx
}
