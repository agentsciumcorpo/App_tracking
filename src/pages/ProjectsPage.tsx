import { useState } from 'react'
import { useProjectsContext } from '../contexts/ProjectsContext'
import { ProjectForm } from '../components/projects/ProjectForm'
import { PROJECT_COLORS } from '../lib/utils'
import type { Project } from '../types'

export function ProjectsPage() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjectsContext()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-zinc-900 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100">Projets</h1>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            + Nouveau projet
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {showForm && (
        <ProjectForm
          onSubmit={createProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <ProjectForm
          initial={editing}
          onSubmit={(name, color) => updateProject(editing.id, name, color)}
          onCancel={() => setEditing(null)}
        />
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
          <p className="text-lg">Aucun projet</p>
          <p className="text-sm">Créez votre premier projet pour organiser vos tâches.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block h-3 w-3 rounded-full ${PROJECT_COLORS[project.color].bg}`} />
                <span className="text-zinc-100">{project.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(project); setShowForm(false) }}
                  className="rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm(`Supprimer le projet "${project.name}" ?`)) return
                    await deleteProject(project.id)
                  }}
                  className="rounded px-2 py-1 text-xs text-red-400 transition-colors hover:bg-zinc-700 hover:text-red-300"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
