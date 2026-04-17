-- Add to your existing Supabase schema
CREATE TABLE ppt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'business', 'education', 'technical', 'cybersecurity'
    file_path TEXT, -- Path in Supabase Storage
    thumbnail_url TEXT,
    placeholder_schema JSONB, -- Defines what placeholders exist
    is_public BOOLEAN DEFAULT false,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ppt_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    template_id UUID REFERENCES ppt_templates(id),
    prompt TEXT,
    generated_content JSONB,
    output_url TEXT,
    status VARCHAR(50), -- 'processing', 'completed', 'failed'
    language VARCHAR(10) DEFAULT 'en',
    course_context JSONB, -- Link to specific course/project
    created_at TIMESTAMP DEFAULT NOW()
);

-- Note: This requires the courses table to exist. Assuming it does, or will comment if not. 
-- For now we implement as requested, but if it fails, we may need to define courses table.
CREATE TABLE course_ppt_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    ppt_template_id UUID REFERENCES ppt_templates(id),
    auto_generate BOOLEAN DEFAULT true,
    generation_rules JSONB -- When to auto-generate
);
