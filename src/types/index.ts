export interface Project {
  id: string
  user_id: string
  name: string
  color: ProjectColor
  created_at: string
}

export type ProjectColor =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'indigo'
  | 'gray'

export interface ActiveTimer {
  id: string
  user_id: string
  task_name: string
  started_at: string
  project_id: string
}

export interface Task {
  id: string
  user_id: string
  task_name: string
  started_at: string
  ended_at: string
  duration_minutes: number
  project_id: string
  rating: number | null
}

export interface WeeklyAnalysis {
  id: string
  user_id: string
  week_start: string
  week_end: string
  content: string
  created_at: string
}
