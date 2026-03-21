import { memo } from 'react'
import type { Project } from '../../types'
import { PROJECT_COLORS } from '../../lib/utils'

interface ProjectFilterProps {
  projects: Project[]
  selectedId: string | null
  onChange: (projectId: string | null) => void
}

export const ProjectFilter = memo(function ProjectFilter({
  projects,
  selectedId,
  onChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-3 py-1 text-sm transition-colors ${
          selectedId === null
            ? 'bg-emerald-600 text-white'
            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
        }`}
      >
        Tous
      </button>
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onChange(project.id)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors ${
            selectedId === project.id
              ? 'bg-zinc-700 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className={`inline-block h-2 w-2 rounded-full ${PROJECT_COLORS[project.color].bg}`} />
          {project.name}
        </button>
      ))}
    </div>
  )
})
