-- 002_rls_policies.sql

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profiles" ON profiles
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_tasks" ON tasks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Habits
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_habits" ON habits
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Habit Logs
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_habit_logs" ON habit_logs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
