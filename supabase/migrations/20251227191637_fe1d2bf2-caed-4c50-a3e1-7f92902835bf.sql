-- Add validation constraints to waiting_list table
ALTER TABLE waiting_list
ADD CONSTRAINT check_user_type 
CHECK (user_type IN ('job_seeker', 'employer'));

ALTER TABLE waiting_list
ADD CONSTRAINT check_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

ALTER TABLE waiting_list
ADD CONSTRAINT check_first_name_length
CHECK (first_name IS NULL OR length(first_name) <= 50);

ALTER TABLE waiting_list
ADD CONSTRAINT check_last_name_length
CHECK (last_name IS NULL OR length(last_name) <= 50);

ALTER TABLE waiting_list
ADD CONSTRAINT check_email_length
CHECK (length(email) <= 255);