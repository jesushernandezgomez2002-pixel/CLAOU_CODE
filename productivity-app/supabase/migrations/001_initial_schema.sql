-- 001_initial_schema.sql

-- Profiles
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'todo'
               CHECK (status IN ('todo', 'in_progress', 'done')),
  priority     TEXT NOT NULL DEFAULT 'medium'
               CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tasks_user_status   ON tasks (user_id, status);
CREATE INDEX idx_tasks_user_due_date ON tasks (user_id, due_date) WHERE due_date IS NOT NULL;

-- Habits
CREATE TABLE habits (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  color        TEXT DEFAULT '#6366f1',
  icon         TEXT DEFAULT '✓',
  frequency    TEXT NOT NULL DEFAULT 'daily'
               CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
  custom_days  INTEGER[],
  target_count INTEGER DEFAULT 1,
  archived     BOOLEAN DEFAULT false,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Habit Logs
CREATE TABLE habit_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id    UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL,
  count       INTEGER DEFAULT 1,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (habit_id, logged_date)
);

CREATE INDEX idx_habit_logs_user_date  ON habit_logs (user_id, logged_date DESC);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs (habit_id, logged_date DESC);
