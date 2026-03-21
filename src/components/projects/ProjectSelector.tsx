import { memo } from 'react'
import type { Project } from '../../types'
import { PROJECT_COLORS } from '../../lib/utils'

interface ProjectSelectorProps {
  projects: Project[]
  selectedId: string | null
  onChange: (projectId: string) => void
  disabled?: boolean
  hasError?: boolean
}

export const ProjectSelector = memo(function ProjectSelector({
  projects,
  selectedId,
  onChange,
  disabled = false,
  hasError = false,
}: ProjectSelectorProps) {
  const selected = projects.find((p) => p.id === selectedId)

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        {selected && (
          <span
            className={`inline-block h-3 w-3 rounded-full ${PROJECT_COLORS[selected.color].bg}`}
          />
        )}
        <select
          value={selectedId ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg border bg-zinc-800 px-4 py-3 text-zinc-100 outline-none transition-colors ${
            hasError
              ? 'border-red-500 focus:border-red-400'
              : 'border-zinc-700 focus:border-emerald-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="" disabled>
            Sélectionner un projet...
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
})
