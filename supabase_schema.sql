-- Enable RLS for all tables
-- All tables should have a user_id column that links to auth.users.id

-- 5. Goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    vision TEXT,
    description TEXT,
    deadline TIMESTAMPTZ,
    target_date TIMESTAMPTZ,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    horizon TEXT CHECK (horizon IN ('life', 'long', 'mid', 'short')) DEFAULT 'mid',
    area TEXT,
    status TEXT DEFAULT 'active',
    completed BOOLEAN DEFAULT false,
    strategic_notes TEXT,
    parent_id UUID REFERENCES goals(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own goals" ON goals FOR ALL USING (auth.uid() = user_id);

CREATE TABLE goal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    work_done TEXT,
    lessons TEXT,
    next_step TEXT,
    mood INTEGER CHECK (mood BETWEEN 1 AND 5),
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE goal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own goal logs" ON goal_logs FOR ALL USING (auth.uid() = user_id);

-- 10. Projects (PARA)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    intent TEXT,
    description TEXT,
    icon TEXT,
    color TEXT,
    bg TEXT,
    status TEXT DEFAULT 'active',
    type TEXT CHECK (type IN ('project', 'area', 'resource', 'archive')) DEFAULT 'project',
    progress FLOAT DEFAULT 0,
    deadline TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projects" ON projects FOR ALL USING (auth.uid() = user_id);

CREATE TABLE project_scratchpad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('note', 'task')) DEFAULT 'note',
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE project_scratchpad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own project scratchpad" ON project_scratchpad FOR ALL USING (auth.uid() = user_id);

CREATE TABLE project_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('link', 'file', 'reference')),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own project resources" ON project_resources FOR ALL USING (auth.uid() = user_id);

-- 1. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    link TEXT,
    deadline TIMESTAMPTZ,
    scheduled TIMESTAMPTZ,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasks" ON tasks 
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. Habits
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#00ff9d',
    icon TEXT,
    frequency TEXT DEFAULT 'daily',
    streak INTEGER DEFAULT 0,
    last_completed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.1 Habit Checkins (Normalized)
CREATE TABLE habit_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('completed', 'skipped')) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, date)
);
ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own habit checkins" ON habit_checkins 
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own habits" ON habits 
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Fitness
CREATE TABLE fitness_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    duration INTEGER, -- in minutes
    calories INTEGER,
    type TEXT,
    difficulty TEXT,
    exercises JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE fitness_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own workouts" ON fitness_workouts 
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE fitness_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
    weight_goal NUMERIC(12, 2) DEFAULT 70,
    step_goal INTEGER DEFAULT 10000,
    water_goal NUMERIC(12, 2) DEFAULT 2.5,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE fitness_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own fitness stats" ON fitness_stats FOR ALL USING (auth.uid() = user_id);

CREATE TABLE fitness_weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    value NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE fitness_weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own weight logs" ON fitness_weight_logs FOR ALL USING (auth.uid() = user_id);

CREATE TABLE fitness_sleep_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    hours NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE fitness_sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sleep logs" ON fitness_sleep_logs FOR ALL USING (auth.uid() = user_id);

CREATE TABLE fitness_daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    steps INTEGER DEFAULT 0,
    water NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);
ALTER TABLE fitness_daily_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own daily metrics" ON fitness_daily_metrics FOR ALL USING (auth.uid() = user_id);

-- 4. Nutrition
CREATE TABLE nutrition_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    calories INTEGER DEFAULT 0,
    protein INTEGER DEFAULT 0,
    carbs INTEGER DEFAULT 0,
    fats INTEGER DEFAULT 0,
    type TEXT CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')) DEFAULT 'snack',
    date TIMESTAMPTZ DEFAULT NOW(),
    time TEXT,
    is_frequent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE nutrition_meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own meals" ON nutrition_meals 
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE nutrition_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
    target_calories INTEGER DEFAULT 2000,
    target_protein INTEGER DEFAULT 150,
    target_carbs INTEGER DEFAULT 200,
    target_fat INTEGER DEFAULT 70,
    target_water NUMERIC(12, 2) DEFAULT 3.0,
    water_intake NUMERIC(12, 2) DEFAULT 0,
    age INTEGER,
    sex TEXT CHECK (sex IN ('male', 'female')),
    height NUMERIC(12, 2),
    weight NUMERIC(12, 2),
    activity_level TEXT,
    last_reset TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE nutrition_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own nutrition settings" ON nutrition_settings FOR ALL USING (auth.uid() = user_id);

-- 6. Journal
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    mood TEXT,
    weather TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);

-- 7. Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    folder TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON notes FOR ALL USING (auth.uid() = user_id);

-- 8. Finance
CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    category TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own transactions" ON finance_transactions FOR ALL USING (auth.uid() = user_id);

CREATE TABLE finance_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    spent NUMERIC(12, 2) DEFAULT 0,
    period TEXT DEFAULT 'monthly',
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE finance_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own budgets" ON finance_budgets FOR ALL USING (auth.uid() = user_id);

CREATE TABLE finance_savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    current_amount NUMERIC(12, 2) DEFAULT 0,
    deadline TIMESTAMPTZ,
    color TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE finance_savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own savings goals" ON finance_savings_goals FOR ALL USING (auth.uid() = user_id);

CREATE TABLE finance_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('stock', 'crypto', 'mutual_fund', 'real_estate', 'other')),
    amount_invested NUMERIC(12, 2) NOT NULL,
    current_value NUMERIC(12, 2) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE finance_investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own investments" ON finance_investments FOR ALL USING (auth.uid() = user_id);

CREATE TABLE finance_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    is_paid BOOLEAN DEFAULT false,
    recurring BOOLEAN DEFAULT false,
    frequency TEXT,
    type TEXT CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE finance_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reminders" ON finance_reminders FOR ALL USING (auth.uid() = user_id);

-- 9. Library
CREATE TABLE library_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    author TEXT,
    why TEXT,
    status TEXT DEFAULT 'to_read',
    rating INTEGER CHECK (rating BETWEEN 0 AND 5) DEFAULT 0,
    progress INTEGER DEFAULT 0,
    total_pages INTEGER,
    cover_url TEXT,
    subjects TEXT[] DEFAULT '{}',
    last_activity_date TIMESTAMPTZ DEFAULT NOW(),
    added_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own library" ON library_items FOR ALL USING (auth.uid() = user_id);

CREATE TABLE library_scratchpad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    item_id UUID REFERENCES library_items(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    promoted_to_note_id UUID, -- No FK to avoid circular dependency in simple schema but good practice
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE library_scratchpad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own scratchpad" ON library_scratchpad FOR ALL USING (auth.uid() = user_id);

-- 11. Calendar
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    date DATE, -- YYYY-MM-DD
    type TEXT CHECK (type IN ('meeting', 'event', 'reminder', 'task')) DEFAULT 'event',
    location TEXT,
    color TEXT DEFAULT '#00ff9d',
    all_day BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- 13. Gamification
CREATE TABLE gamification_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
    username TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 0,
    avatar JSONB,
    achievements TEXT[] DEFAULT '{}',
    badges TEXT[] DEFAULT '{}',
    completed_quests TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE gamification_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own gamification profile" ON gamification_profiles FOR ALL USING (auth.uid() = user_id);

CREATE TABLE gamification_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    rarity TEXT,
    category TEXT,
    requirements JSONB,
    xp_reward INTEGER DEFAULT 0,
    gold_reward INTEGER DEFAULT 0,
    badge_id TEXT,
    progress FLOAT DEFAULT 0,
    max_progress FLOAT DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    is_hidden BOOLEAN DEFAULT false,
    "order" INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE gamification_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own achievements" ON gamification_achievements FOR ALL USING (auth.uid() = user_id);

CREATE TABLE gamification_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT,
    title TEXT,
    message TEXT,
    icon TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE gamification_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications" ON gamification_notifications FOR ALL USING (auth.uid() = user_id);

CREATE TABLE gamification_xp_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount INTEGER NOT NULL,
    source TEXT,
    source_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE gamification_xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own xp events" ON gamification_xp_events FOR ALL USING (auth.uid() = user_id);

CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
    theme TEXT DEFAULT 'dark',
    accent_color TEXT DEFAULT '#00ff9d',
    features JSONB DEFAULT '{"habits": true, "tasks": true, "fitness": true, "nutrition": true, "goals": true, "finance": true, "journal": true, "notes": true, "library": true, "projects": true, "calendar": true}',
    mobile_nav_items TEXT[] DEFAULT '{"dashboard", "projects", "tasks"}',
    layout_style TEXT DEFAULT 'card',
    font_size TEXT DEFAULT 'normal',
    animations BOOLEAN DEFAULT true,
    border_radius INTEGER DEFAULT 16,
    module_padding INTEGER DEFAULT 24,
    dashboard_widgets JSONB,
    page_preferences JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- 14. Automatic Profile Creation
-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);

  -- Insert into gamification_profiles
  INSERT INTO public.gamification_profiles (user_id, username, avatar)
  VALUES (new.id, split_part(new.email, '@', 1), '{"class": "Warrior", "name": "Hero", "customization": {"skinTone": "#fdbcb4", "hairStyle": "short", "hairColor": "#4a3728", "eyeColor": "#6b4423", "outfit": "starter"}, "equipment": {}}'::jsonb);

  -- Insert into fitness_stats
  INSERT INTO public.fitness_stats (user_id)
  VALUES (new.id);

  -- Insert into nutrition_settings
  INSERT INTO public.nutrition_settings (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant explicitly to authenticated role
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Global updated_at handler
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all mutable tables
CREATE TRIGGER set_updated_at_tasks BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_habits BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_goals BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_journal_entries BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_notes BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_finance_transactions BEFORE UPDATE ON finance_transactions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_finance_budgets BEFORE UPDATE ON finance_budgets FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_finance_savings_goals BEFORE UPDATE ON finance_savings_goals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_finance_investments BEFORE UPDATE ON finance_investments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_finance_reminders BEFORE UPDATE ON finance_reminders FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_gamification_profiles BEFORE UPDATE ON gamification_profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_gamification_achievements BEFORE UPDATE ON gamification_achievements FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_user_settings BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Decision Views for Dashboard
CREATE OR REPLACE VIEW v_today_decisions AS
SELECT 
    'task' as type,
    id,
    user_id,
    title,
    deadline as focus_time,
    priority,
    status
FROM tasks 
WHERE status != 'completed' AND (deadline::date = CURRENT_DATE OR deadline < NOW())
UNION ALL
SELECT 
    'event' as type,
    id,
    user_id,
    title,
    start_time as focus_time,
    'medium' as priority,
    'pending' as status
FROM calendar_events 
WHERE date = CURRENT_DATE OR (start_time::date = CURRENT_DATE);
