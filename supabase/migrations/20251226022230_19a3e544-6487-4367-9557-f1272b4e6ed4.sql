-- Fix the function search path warning for calculate_profile_completion
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(_profile profiles)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    score INTEGER := 0;
    total INTEGER := 10;
BEGIN
    IF _profile.first_name IS NOT NULL AND _profile.first_name != '' THEN score := score + 1; END IF;
    IF _profile.last_name IS NOT NULL AND _profile.last_name != '' THEN score := score + 1; END IF;
    IF _profile.phone IS NOT NULL AND _profile.phone != '' THEN score := score + 1; END IF;
    IF _profile.headline IS NOT NULL AND _profile.headline != '' THEN score := score + 1; END IF;
    IF _profile.bio IS NOT NULL AND _profile.bio != '' THEN score := score + 1; END IF;
    IF _profile.location IS NOT NULL AND _profile.location != '' THEN score := score + 1; END IF;
    IF _profile.resume_url IS NOT NULL AND _profile.resume_url != '' THEN score := score + 2; END IF;
    IF array_length(_profile.skills, 1) > 0 THEN score := score + 1; END IF;
    IF jsonb_array_length(_profile.work_experience) > 0 THEN score := score + 1; END IF;
    
    RETURN (score * 100 / total);
END;
$$;