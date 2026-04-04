-- 004_functions.sql

-- Returns current streak for a habit
CREATE OR REPLACE FUNCTION get_habit_streak(p_habit_id UUID)
RETURNS INTEGER AS $$
  WITH ordered AS (
    SELECT logged_date,
           logged_date - (ROW_NUMBER() OVER (ORDER BY logged_date))::INTEGER AS grp
    FROM habit_logs
    WHERE habit_id = p_habit_id
    ORDER BY logged_date DESC
  ),
  streak_groups AS (
    SELECT grp, MAX(logged_date) AS last_date, COUNT(*) AS len
    FROM ordered
    GROUP BY grp
  )
  SELECT COALESCE(
    (SELECT len FROM streak_groups
     WHERE last_date >= CURRENT_DATE - INTERVAL '1 day'
     ORDER BY last_date DESC
     LIMIT 1),
    0
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
