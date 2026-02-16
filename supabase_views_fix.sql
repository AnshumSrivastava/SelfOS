-- Fix Dashboard Views
-- Run this in the Supabase SQL Editor

-- 1. Drop existing views to ensure clean state
DROP VIEW IF EXISTS v_today_decisions;
DROP VIEW IF EXISTS v_momentum_risks;
DROP VIEW IF EXISTS v_finance_due_alerts;
DROP VIEW IF EXISTS v_goal_next_steps;

-- 2. Re-create views with SECURITY_INVOKER = on (Respects RLS)

-- v_today_decisions: Combines Tasks and Calendar Events
CREATE OR REPLACE VIEW v_today_decisions WITH (security_invoker = on) AS
SELECT 
    'task' as type,
    t.id,
    t.user_id,
    t.title as label,
    t.deadline as focus_time,
    t.priority,
    t.status,
    p.name as context_label,
    CASE 
        WHEN t.priority = 'high' THEN 30
        WHEN t.priority = 'medium' THEN 20
        ELSE 10
    END + 
    CASE 
        WHEN t.deadline < NOW() THEN 50
        WHEN t.deadline::date = CURRENT_DATE THEN 25
        ELSE 0
    END as score
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
WHERE t.status != 'completed' AND (t.deadline::date = CURRENT_DATE OR t.deadline < NOW())
UNION ALL
SELECT 
    'event' as type,
    id,
    user_id,
    title as label,
    start_time as focus_time,
    'high' as priority,
    'pending' as status,
    'Calendar' as context_label,
    40 as score
FROM calendar_events 
WHERE date = CURRENT_DATE OR (start_time::date = CURRENT_DATE);

-- v_momentum_risks: Habits not done today
CREATE OR REPLACE VIEW v_momentum_risks WITH (security_invoker = on) AS
SELECT 
    h.id,
    h.user_id,
    h.name,
    h.streak,
    h.color
FROM habits h
LEFT JOIN habit_checkins hc ON h.id = hc.habit_id AND hc.date = CURRENT_DATE
WHERE h.streak > 0 AND hc.id IS NULL;

-- v_finance_due_alerts: Unpaid reminders due soon
CREATE OR REPLACE VIEW v_finance_due_alerts WITH (security_invoker = on) AS
SELECT 
    id,
    user_id,
    title,
    amount,
    due_date,
    type
FROM finance_reminders
WHERE is_paid = false AND due_date <= (NOW() + INTERVAL '3 days');

-- v_goal_next_steps: Active goals with defined next steps
CREATE OR REPLACE VIEW v_goal_next_steps WITH (security_invoker = on) AS
SELECT 
    g.id,
    g.user_id,
    g.title as goal_title,
    gl.next_step
FROM goals g
JOIN (
    SELECT DISTINCT ON (goal_id) goal_id, next_step, date
    FROM goal_logs
    ORDER BY goal_id, date DESC
) gl ON g.id = gl.goal_id
WHERE g.completed = false AND gl.next_step IS NOT NULL;

-- Grant access to authenticated users
GRANT SELECT ON v_today_decisions TO authenticated;
GRANT SELECT ON v_momentum_risks TO authenticated;
GRANT SELECT ON v_finance_due_alerts TO authenticated;
GRANT SELECT ON v_goal_next_steps TO authenticated;
