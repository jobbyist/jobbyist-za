-- Add subscription and premium features

-- Create enum for subscription types
CREATE TYPE public.subscription_type AS ENUM ('jobseeker_pro', 'recruitment_suite');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- Create enum for plan tiers
CREATE TYPE public.plan_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_type subscription_type NOT NULL,
    plan_tier plan_tier NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'trial',
    features JSONB DEFAULT '{}',
    price_paid INTEGER,
    currency TEXT DEFAULT 'ZAR',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Upskilling programs table
CREATE TABLE public.upskilling_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    level TEXT, -- Beginner, Intermediate, Advanced
    duration_weeks INTEGER,
    skills TEXT[] DEFAULT '{}',
    badge_icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Upskilling enrollments table
CREATE TABLE public.upskilling_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.upskilling_programs(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0, -- 0-100%
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, program_id)
);

-- Jobseeker profiles database (public-facing verified profiles)
CREATE TABLE public.jobseeker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_searchable BOOLEAN NOT NULL DEFAULT true,
    available_for_hire BOOLEAN NOT NULL DEFAULT true,
    expected_salary_min INTEGER,
    expected_salary_max INTEGER,
    preferred_job_types TEXT[] DEFAULT '{}',
    preferred_locations TEXT[] DEFAULT '{}',
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Follows table (users can follow jobseekers, companies, recruiters)
CREATE TABLE public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Conversations table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(participant1_id, participant2_id),
    CHECK (participant1_id != participant2_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upskilling_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upskilling_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobseeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Function to check if users follow each other
CREATE OR REPLACE FUNCTION public.users_follow_each_other(_user1_id UUID, _user2_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.follows
        WHERE follower_id = _user1_id AND following_id = _user2_id
    ) AND EXISTS (
        SELECT 1 FROM public.follows
        WHERE follower_id = _user2_id AND following_id = _user1_id
    )
$$;

-- Function to check if user has active premium subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID, _subscription_type subscription_type)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = _user_id
          AND subscription_type = _subscription_type
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > now())
    )
$$;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions"
ON public.subscriptions FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for upskilling_programs
CREATE POLICY "Active programs are viewable by everyone"
ON public.upskilling_programs FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage programs"
ON public.upskilling_programs FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for upskilling_enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.upskilling_enrollments FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own enrollments"
ON public.upskilling_enrollments FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for jobseeker_profiles
CREATE POLICY "Public jobseeker profiles are viewable by everyone"
ON public.jobseeker_profiles FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can update their own jobseeker profile"
ON public.jobseeker_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own jobseeker profile"
ON public.jobseeker_profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all jobseeker profiles"
ON public.jobseeker_profiles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for follows
CREATE POLICY "Users can view all follows"
ON public.follows FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own follows"
ON public.follows FOR ALL
TO authenticated
USING (follower_id = auth.uid());

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can create conversations if they follow each other and have premium"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (
    (participant1_id = auth.uid() OR participant2_id = auth.uid()) AND
    public.users_follow_each_other(participant1_id, participant2_id)
);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE conversations.id = messages.conversation_id
        AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
    )
);

CREATE POLICY "Users can send messages in their conversations"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE conversations.id = messages.conversation_id
        AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
    )
);

CREATE POLICY "Users can update messages they received"
ON public.messages FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE conversations.id = messages.conversation_id
        AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
        AND sender_id != auth.uid()
    )
);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.upskilling_programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobseeker_profiles_updated_at
BEFORE UPDATE ON public.jobseeker_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_upskilling_enrollments_user ON public.upskilling_enrollments(user_id);
CREATE INDEX idx_upskilling_enrollments_program ON public.upskilling_enrollments(program_id);
CREATE INDEX idx_jobseeker_profiles_user ON public.jobseeker_profiles(user_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_conversations_participants ON public.conversations(participant1_id, participant2_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- Insert default upskilling programs
INSERT INTO public.upskilling_programs (name, slug, description, category, level, duration_weeks, skills) VALUES
('Frontend Development Bootcamp', 'frontend-bootcamp', 'Master modern frontend technologies including React, Vue, and responsive design', 'Frontend', 'Beginner', 12, ARRAY['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript']),
('Backend Engineering Path', 'backend-engineering', 'Learn server-side development with Node.js, Python, and database management', 'Backend', 'Intermediate', 16, ARRAY['Node.js', 'Python', 'SQL', 'REST APIs', 'MongoDB']),
('Data Science Fundamentals', 'data-science-fundamentals', 'Introduction to data analysis, visualization, and machine learning', 'Data Science', 'Beginner', 14, ARRAY['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Statistics']),
('DevOps & Cloud Infrastructure', 'devops-cloud', 'Master CI/CD, Docker, Kubernetes, and cloud platforms', 'DevOps', 'Advanced', 12, ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux']),
('Mobile App Development', 'mobile-development', 'Build cross-platform mobile apps with React Native and Flutter', 'Mobile', 'Intermediate', 10, ARRAY['React Native', 'Flutter', 'Mobile UI', 'Firebase']),
('Cybersecurity Essentials', 'cybersecurity', 'Learn security fundamentals, ethical hacking, and network security', 'Security', 'Intermediate', 8, ARRAY['Network Security', 'Penetration Testing', 'Encryption', 'Security Auditing']),
('UI/UX Design Mastery', 'ui-ux-design', 'Create beautiful and user-friendly interfaces with modern design tools', 'Design', 'Beginner', 8, ARRAY['Figma', 'User Research', 'Prototyping', 'Design Systems']),
('Full Stack JavaScript', 'fullstack-javascript', 'Complete JavaScript stack from frontend to backend', 'Full Stack', 'Intermediate', 20, ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript']);
