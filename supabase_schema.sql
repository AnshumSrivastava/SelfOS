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
    retyped_from_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    original_date DATE,
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
    category TEXT, -- Added for new SRS
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

-- 3. Identity (Core Philosophy Engine)
CREATE TABLE identity_traits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE identity_traits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own identity traits" ON identity_traits FOR ALL USING (auth.uid() = user_id);

CREATE TABLE identity_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    trait_id UUID REFERENCES identity_traits(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    is_aligned BOOLEAN DEFAULT true,
    reflection TEXT, -- Mandatory if is_aligned is false
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE identity_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own identity actions" ON identity_actions FOR ALL USING (auth.uid() = user_id);

-- 4. Fitness & Nutrition (Health domain)
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

CREATE TABLE fitness_daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    steps INTEGER DEFAULT 0,
    water NUMERIC(12, 2) DEFAULT 0, -- Water intake tracker
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);
ALTER TABLE fitness_daily_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own daily metrics" ON fitness_daily_metrics FOR ALL USING (auth.uid() = user_id);

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
    reflection_tag TEXT, -- Optional reflection tagging
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
    last_reset TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE nutrition_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own nutrition settings" ON nutrition_settings FOR ALL USING (auth.uid() = user_id);

-- 5. Goals & Projects (PARA System)
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

-- 6. Journal & Notes
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

-- 7. Finance
CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    category TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    tags TEXT[],
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL, -- Link to goals
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Link to projects
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own transactions" ON finance_transactions FOR ALL USING (auth.uid() = user_id);

-- 8. Library
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
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    last_activity_date TIMESTAMPTZ DEFAULT NOW(),
    added_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own library" ON library_items FOR ALL USING (auth.uid() = user_id);

-- 9. Connections / Network
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    contact_info TEXT, -- URL or Number
    relationship_goals TEXT,
    categories TEXT[] DEFAULT '{}',
    last_contacted_at TIMESTAMPTZ,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own connections" ON connections FOR ALL USING (auth.uid() = user_id);

-- 10. Calendar & Reminders
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

CREATE TABLE system_notifications (
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
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications" ON system_notifications FOR ALL USING (auth.uid() = user_id);

-- 11. Focus Sessions
CREATE TABLE focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration INTEGER, -- in minutes
    type TEXT CHECK (type IN ('timer', 'stopwatch')),
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own focus sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id);

-- 12. Settings
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
    theme TEXT DEFAULT 'dark',
    accent_color TEXT DEFAULT '#00ff9d',
    features JSONB DEFAULT '{"habits": true, "tasks": true, "fitness": true, "nutrition": true, "goals": true, "finance": true, "journal": true, "notes": true, "library": true, "projects": true, "calendar": true, "identity": true, "connections": true, "focus": true}',
    mobile_nav_items TEXT[] DEFAULT '{"dashboard", "projects", "tasks"}',
    layout_style TEXT DEFAULT 'card',
    font_size TEXT DEFAULT 'normal',
    animations BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- 13. Automatic Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);

  INSERT INTO public.fitness_stats (user_id)
  VALUES (new.id);

  INSERT INTO public.nutrition_settings (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

CREATE TRIGGER set_updated_at_tasks BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_habits BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_goals BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_journal_entries BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_notes BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_finance_transactions BEFORE UPDATE ON finance_transactions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_user_settings BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Views for Dashboard
CREATE OR REPLACE VIEW v_today_dashboard AS
SELECT 
    'task' as type,
    t.id,
    t.user_id,
    t.title as label,
    t.deadline as focus_time,
    t.priority,
    t.status,
    p.name as context_label
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
    'Calendar' as context_label
FROM calendar_events 
WHERE date = CURRENT_DATE OR (start_time::date = CURRENT_DATE);
