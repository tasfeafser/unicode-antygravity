-- Initial Supabase Schema for Unicode

-- =========================================================================
-- ENUMS & TYPES
-- =========================================================================
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE exercise_type AS ENUM ('coding', 'quiz', 'linux', 'security', 'project');

-- =========================================================================
-- TABLES
-- =========================================================================

-- 1. Profiles (linked to Clerk user_id)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role user_role DEFAULT 'student'::user_role,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Subscriptions (payment tiers)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    tier subscription_tier DEFAULT 'free'::subscription_tier,
    status TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Courses (curriculum structure)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    exercise_type exercise_type,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enrollments (user progress)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(profile_id, course_id)
);

CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(enrollment_id, lesson_id)
);

-- 4. Projects (student projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    github_url TEXT,
    live_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CodeSessions (IDE state)
CREATE TABLE code_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    language TEXT NOT NULL,
    code_content TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AIInteractions (chat history, context)
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT NOT NULL,
    context_type TEXT, -- e.g., 'code_help', 'concept_explanation'
    prompt TEXT NOT NULL,
    completion TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Documents (generated docs, PPTs)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL, -- e.g., 'pdf', 'ppt', 'md'
    file_url TEXT NOT NULL,
    ai_generation_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. LinuxSimulations (terminal sessions)
CREATE TABLE linux_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    command_history JSONB DEFAULT '[]'::jsonb,
    filesystem_state JSONB DEFAULT '{}'::jsonb,
    completed_tasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SecurityLabs (cybersecurity exercises)
CREATE TABLE security_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    lab_scenario TEXT NOT NULL,
    flags_captured JSONB DEFAULT '[]'::jsonb,
    hints_used INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Analytics Events Log (for the trigger)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =========================================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX idx_subscriptions_profile_id ON subscriptions(profile_id);
CREATE INDEX idx_enrollments_profile_id ON enrollments(profile_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX idx_projects_profile_id ON projects(profile_id);
CREATE INDEX idx_code_sessions_profile_id ON code_sessions(profile_id);
CREATE INDEX idx_ai_interactions_profile_id ON ai_interactions(profile_id);
CREATE INDEX idx_ai_interactions_session_id ON ai_interactions(session_id);


-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_labs ENABLE ROW LEVEL SECURITY;

-- Helper Function to get profile_id from Clerk ID
-- Assuming the backend verifies JWTs and sets request.jwt.claims.sub to the Clerk ID
CREATE OR REPLACE FUNCTION auth.clerk_user_id() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.current_profile_id() RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE clerk_id = auth.clerk_user_id() LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Profiles: Users can read/update their own profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (clerk_id = auth.clerk_user_id());
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (clerk_id = auth.clerk_user_id());

-- Subscriptions: Users can read their own
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (profile_id = auth.current_profile_id());

-- Courses, Modules, Lessons: Public can read if published
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can view modules" ON modules
    FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON lessons
    FOR SELECT USING (true);

-- Enrollments: Users can read/insert their own
CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (profile_id = auth.current_profile_id());
CREATE POLICY "Users can insert own enrollments" ON enrollments
    FOR INSERT WITH CHECK (profile_id = auth.current_profile_id());

-- Lesson Progress: Users handle their own
CREATE POLICY "Users can manage own lesson progress" ON lesson_progress
    FOR ALL USING (
        enrollment_id IN (SELECT id FROM enrollments WHERE profile_id = auth.current_profile_id())
    );

-- Projects: Users manage their own, everyone can view public ones
CREATE POLICY "Users can manage own projects" ON projects
    FOR ALL USING (profile_id = auth.current_profile_id());
CREATE POLICY "Anyone can view public projects" ON projects
    FOR SELECT USING (is_public = true);

-- Code Sessions, AI Interactions, Documents, LinuxSimulations, SecurityLabs: Own data only
CREATE POLICY "Users can manage own code sessions" ON code_sessions
    FOR ALL USING (profile_id = auth.current_profile_id());
CREATE POLICY "Users can manage own ai interactions" ON ai_interactions
    FOR ALL USING (profile_id = auth.current_profile_id());
CREATE POLICY "Users can manage own docs" ON documents
    FOR ALL USING (profile_id = auth.current_profile_id());
CREATE POLICY "Users can manage own linux sims" ON linux_simulations
    FOR ALL USING (profile_id = auth.current_profile_id());
CREATE POLICY "Users can manage own security labs" ON security_labs
    FOR ALL USING (profile_id = auth.current_profile_id());


-- =========================================================================
-- FUNCTIONS
-- =========================================================================

-- Function: calculate_user_progress
-- Description: Returns the percentage completion for a given user and course
CREATE OR REPLACE FUNCTION calculate_user_progress(p_profile_id UUID, p_course_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    v_enrollment_id UUID;
BEGIN
    SELECT id INTO v_enrollment_id FROM enrollments WHERE profile_id = p_profile_id AND course_id = p_course_id;
    IF v_enrollment_id IS NULL THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*) INTO total_lessons 
    FROM lessons l 
    JOIN modules m ON l.module_id = m.id 
    WHERE m.course_id = p_course_id;

    IF total_lessons = 0 THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*) INTO completed_lessons 
    FROM lesson_progress 
    WHERE enrollment_id = v_enrollment_id AND is_completed = true;

    RETURN ROUND((completed_lessons::NUMERIC / total_lessons::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function: get_course_recommendations
-- Description: Simple placeholder for course recommendations based on user's current track
CREATE OR REPLACE FUNCTION get_course_recommendations(p_profile_id UUID, p_limit INTEGER DEFAULT 3)
RETURNS SETOF courses AS $$
BEGIN
    -- For demonstration: return highly rated or recently added courses the user is NOT enrolled in.
    RETURN QUERY
    SELECT c.* 
    FROM courses c
    WHERE c.is_published = true 
      AND c.id NOT IN (
          SELECT course_id FROM enrollments WHERE profile_id = p_profile_id
      )
    ORDER BY c.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function: track_learning_metrics
-- Description: Returns aggregate metrics for a user (total courses, completed, projects)
CREATE OR REPLACE FUNCTION track_learning_metrics(p_profile_id UUID)
RETURNS JSONB AS $$
DECLARE
    total_enrolled INTEGER;
    total_completed INTEGER;
    total_projects INTEGER;
    ai_calls INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_enrolled FROM enrollments WHERE profile_id = p_profile_id;
    SELECT COUNT(*) INTO total_completed FROM enrollments WHERE profile_id = p_profile_id AND completed_at IS NOT NULL;
    SELECT COUNT(*) INTO total_projects FROM projects WHERE profile_id = p_profile_id;
    SELECT COUNT(*) INTO ai_calls FROM ai_interactions WHERE profile_id = p_profile_id;

    RETURN jsonb_build_object(
        'total_enrolled_courses', total_enrolled,
        'total_completed_courses', total_completed,
        'total_projects', total_projects,
        'total_ai_interactions', ai_calls
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================================
-- TRIGGERS FOR ANALYTICS EVENTS
-- =========================================================================

-- Example Trigger: Log when an enrollment is created
CREATE OR REPLACE FUNCTION log_analytics_enrollment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO analytics_events (profile_id, event_type, event_data)
    VALUES (
        NEW.profile_id, 
        'course_enrolled', 
        jsonb_build_object('course_id', NEW.course_id, 'enrolled_at', NEW.enrolled_at)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_analytics_enrollment
AFTER INSERT ON enrollments
FOR EACH ROW
EXECUTE FUNCTION log_analytics_enrollment();


-- Example Trigger: Log lesson completion
CREATE OR REPLACE FUNCTION log_analytics_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_profile_id UUID;
    v_course_id UUID;
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        SELECT profile_id, course_id INTO v_profile_id, v_course_id 
        FROM enrollments WHERE id = NEW.enrollment_id;
        
        INSERT INTO analytics_events (profile_id, event_type, event_data)
        VALUES (
            v_profile_id, 
            'lesson_completed', 
            jsonb_build_object('lesson_id', NEW.lesson_id, 'course_id', v_course_id, 'score', NEW.score)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_analytics_lesson_completion
AFTER UPDATE OF is_completed ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION log_analytics_lesson_completion();

-- Example Trigger: Automatically Update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_modtime
BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
