export interface ActiveTimer {
  id: string
  user_id: string
  task_name: string
  started_at: string
}

export interface Task {
  id: string
  user_id: string
  task_name: string
  started_at: string
  ended_at: string
  duration_minutes: number
}
