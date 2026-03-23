-- Migration: Support parallel timers (multiple active timers per user)

-- 1. Drop the unique constraint on user_id in active_timers
--    (allows multiple rows per user)
ALTER TABLE active_timers DROP CONSTRAINT IF EXISTS active_timers_user_id_key;
ALTER TABLE active_timers DROP CONSTRAINT IF EXISTS active_timers_user_id_unique;

-- Also try index-based unique constraint name variants
DROP INDEX IF EXISTS active_timers_user_id_key;
DROP INDEX IF EXISTS active_timers_user_id_idx;
DROP INDEX IF EXISTS active_timers_user_id_unique;

-- 2. Replace complete_timer RPC to accept timer ID instead of finding by user_id
CREATE OR REPLACE FUNCTION complete_timer(
  p_timer_id uuid,
  p_task_name text,
  p_started_at timestamptz,
  p_ended_at timestamptz,
  p_duration_minutes integer,
  p_project_id uuid,
  p_rating integer DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the specific active timer by ID
  DELETE FROM active_timers
  WHERE id = p_timer_id
    AND user_id = auth.uid();

  -- Insert into tasks
  INSERT INTO tasks (user_id, task_name, started_at, ended_at, duration_minutes, project_id, rating)
  VALUES (auth.uid(), p_task_name, p_started_at, p_ended_at, p_duration_minutes, p_project_id, p_rating);
END;
$$;
