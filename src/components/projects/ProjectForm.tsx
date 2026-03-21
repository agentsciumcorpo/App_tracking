import { useState, memo } from 'react'
import type { Project, ProjectColor } from '../../types'
import { ColorPicker } from './ColorPicker'

interface ProjectFormProps {
  initial?: Project
  onSubmit: (name: string, color: ProjectColor) => Promise<boolean>
  onCancel: () => void
}

export const ProjectForm = memo(function ProjectForm({ initial, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState<ProjectColor>(initial?.color ?? 'blue')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await onSubmit(name, color)
    setSubmitting(false)
    if (ok) onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du projet..."
        maxLength={100}
        autoFocus
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
      />
      <ColorPicker selected={color} onChange={setColor} />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {initial ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-600"
        >
          Annuler
        </button>
      </div>
    </form>
  )
})
