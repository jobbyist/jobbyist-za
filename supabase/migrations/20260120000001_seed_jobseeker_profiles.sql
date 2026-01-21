-- Seed 50 South African Jobseeker Profiles
-- This script creates realistic South African jobseeker profiles for the jobseekers database

-- Note: In a real implementation, you would need actual user accounts first
-- This is a template showing the structure. You'll need to create users via Supabase Auth first.

-- Sample South African jobseeker data
-- First, we'll create sample profiles (assuming users exist)

INSERT INTO public.profiles (user_id, email, first_name, last_name, phone, headline, bio, location, country, skills, years_of_experience, verification_status, profile_completion, is_email_verified)
VALUES
  -- Profile 1
  (gen_random_uuid(), 'thabo.ndlovu@example.co.za', 'Thabo', 'Ndlovu', '+27 11 234 5678', 'Senior Full Stack Developer', 'Experienced full-stack developer with 8+ years building scalable web applications. Passionate about clean code and agile methodologies.', 'Johannesburg, Gauteng', 'ZA', ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'], 8, 'approved', 100, true),
  
  -- Profile 2
  (gen_random_uuid(), 'nomsa.khumalo@example.co.za', 'Nomsa', 'Khumalo', '+27 21 345 6789', 'UX/UI Designer', 'Creative designer with a passion for user-centered design. 5 years of experience creating intuitive interfaces for web and mobile.', 'Cape Town, Western Cape', 'ZA', ARRAY['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping'], 5, 'approved', 100, true),
  
  -- Profile 3
  (gen_random_uuid(), 'sipho.mokoena@example.co.za', 'Sipho', 'Mokoena', '+27 31 456 7890', 'Data Scientist', 'Data scientist specializing in machine learning and predictive analytics. PhD in Computer Science from UCT.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R'], 6, 'approved', 100, true),
  
  -- Profile 4
  (gen_random_uuid(), 'lerato.mahlangu@example.co.za', 'Lerato', 'Mahlangu', '+27 12 567 8901', 'DevOps Engineer', 'DevOps specialist with expertise in CI/CD, containerization, and cloud infrastructure. AWS and Azure certified.', 'Pretoria, Gauteng', 'ZA', ARRAY['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'], 7, 'approved', 100, true),
  
  -- Profile 5
  (gen_random_uuid(), 'zanele.dlamini@example.co.za', 'Zanele', 'Dlamini', '+27 41 678 9012', 'Product Manager', 'Product manager with a track record of launching successful digital products. Strong in agile methodologies and stakeholder management.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Product Strategy', 'Agile', 'Scrum', 'Roadmapping', 'Analytics'], 4, 'approved', 100, true),
  
  -- Profile 6
  (gen_random_uuid(), 'thandi.nkosi@example.co.za', 'Thandi', 'Nkosi', '+27 11 789 0123', 'Frontend Developer', 'Frontend developer passionate about creating beautiful, responsive user interfaces. React and Vue.js specialist.', 'Sandton, Gauteng', 'ZA', ARRAY['React', 'Vue.js', 'JavaScript', 'CSS', 'HTML'], 3, 'approved', 100, true),
  
  -- Profile 7
  (gen_random_uuid(), 'lungile.ntuli@example.co.za', 'Lungile', 'Ntuli', '+27 21 890 1234', 'Backend Developer', 'Backend engineer with strong experience in building RESTful APIs and microservices architecture.', 'Stellenbosch, Western Cape', 'ZA', ARRAY['Java', 'Spring Boot', 'MySQL', 'Redis', 'Microservices'], 6, 'approved', 100, true),
  
  -- Profile 8
  (gen_random_uuid(), 'themba.vilakazi@example.co.za', 'Themba', 'Vilakazi', '+27 31 901 2345', 'Mobile Developer', 'iOS and Android developer building native and cross-platform mobile applications.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['React Native', 'Swift', 'Kotlin', 'Firebase', 'Mobile UI'], 4, 'approved', 100, true),
  
  -- Profile 9
  (gen_random_uuid(), 'andile.cele@example.co.za', 'Andile', 'Cele', '+27 12 012 3456', 'Quality Assurance Engineer', 'QA engineer specializing in automated testing and continuous integration. Selenium and Cypress expert.', 'Centurion, Gauteng', 'ZA', ARRAY['Selenium', 'Cypress', 'Jest', 'Test Automation', 'Agile'], 5, 'approved', 100, true),
  
  -- Profile 10
  (gen_random_uuid(), 'precious.mthembu@example.co.za', 'Precious', 'Mthembu', '+27 11 123 4567', 'Digital Marketing Specialist', 'Digital marketing professional with expertise in SEO, SEM, and social media marketing. Google Ads certified.', 'Johannesburg, Gauteng', 'ZA', ARRAY['SEO', 'Google Ads', 'Social Media', 'Content Marketing', 'Analytics'], 3, 'approved', 100, true),
  
  -- Profile 11-20
  (gen_random_uuid(), 'mandla.zulu@example.co.za', 'Mandla', 'Zulu', '+27 21 234 5678', 'Cybersecurity Analyst', 'Security professional protecting systems and data. CISSP certified.', 'Cape Town, Western Cape', 'ZA', ARRAY['Network Security', 'Penetration Testing', 'SIEM', 'Firewall', 'Compliance'], 7, 'approved', 100, true),
  (gen_random_uuid(), 'zinhle.mdlalose@example.co.za', 'Zinhle', 'Mdlalose', '+27 31 345 6789', 'Business Analyst', 'Business analyst bridging the gap between business and IT. Strong in requirements gathering and process improvement.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Requirements Analysis', 'SQL', 'JIRA', 'Process Mapping', 'Agile'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'bongani.ngcobo@example.co.za', 'Bongani', 'Ngcobo', '+27 12 456 7890', 'Cloud Architect', 'Cloud solutions architect designing scalable infrastructure on AWS and Azure.', 'Pretoria, Gauteng', 'ZA', ARRAY['AWS', 'Azure', 'Cloud Architecture', 'Terraform', 'Docker'], 9, 'approved', 100, true),
  (gen_random_uuid(), 'nosipho.dube@example.co.za', 'Nosipho', 'Dube', '+27 41 567 8901', 'Scrum Master', 'Certified Scrum Master facilitating agile teams to deliver value. PSM I certified.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Scrum', 'Agile Coaching', 'JIRA', 'Team Building', 'Facilitation'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'simphiwe.mabaso@example.co.za', 'Simphiwe', 'Mabaso', '+27 11 678 9012', 'Systems Administrator', 'Linux systems administrator with experience managing large-scale infrastructure.', 'Johannesburg, Gauteng', 'ZA', ARRAY['Linux', 'Bash', 'Ansible', 'Monitoring', 'Networking'], 6, 'approved', 100, true),
  (gen_random_uuid(), 'ayanda.mbele@example.co.za', 'Ayanda', 'Mbele', '+27 21 789 0123', 'Content Writer', 'Creative content writer crafting compelling stories for digital platforms.', 'Cape Town, Western Cape', 'ZA', ARRAY['Content Writing', 'SEO', 'Copywriting', 'Blogging', 'Social Media'], 3, 'approved', 100, true),
  (gen_random_uuid(), 'nkosinathi.nxumalo@example.co.za', 'Nkosinathi', 'Nxumalo', '+27 31 890 1234', 'Database Administrator', 'DBA managing PostgreSQL and MySQL databases at scale.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['PostgreSQL', 'MySQL', 'Database Tuning', 'Backup', 'Replication'], 8, 'approved', 100, true),
  (gen_random_uuid(), 'lindiwe.buthelezi@example.co.za', 'Lindiwe', 'Buthelezi', '+27 12 901 2345', 'HR Manager', 'Human resources professional specializing in talent acquisition and employee development.', 'Pretoria, Gauteng', 'ZA', ARRAY['Recruitment', 'HRIS', 'Performance Management', 'Training', 'Employee Relations'], 10, 'approved', 100, true),
  (gen_random_uuid(), 'vusi.mkhize@example.co.za', 'Vusi', 'Mkhize', '+27 41 012 3456', 'Software Architect', 'Software architect designing enterprise-level solutions. 12+ years experience.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['System Design', 'Microservices', 'Architecture Patterns', 'Java', 'Cloud'], 12, 'approved', 100, true),
  (gen_random_uuid(), 'nompumelelo.sithole@example.co.za', 'Nompumelelo', 'Sithole', '+27 11 123 4567', 'Project Manager', 'PMP certified project manager delivering complex IT projects on time and budget.', 'Johannesburg, Gauteng', 'ZA', ARRAY['Project Management', 'PMP', 'Risk Management', 'Budgeting', 'Stakeholder Management'], 8, 'approved', 100, true),
  
  -- Profile 21-30
  (gen_random_uuid(), 'mpho.mohlala@example.co.za', 'Mpho', 'Mohlala', '+27 21 234 5678', 'Graphic Designer', 'Creative graphic designer with a portfolio spanning brand identity, print, and digital design.', 'Cape Town, Western Cape', 'ZA', ARRAY['Adobe Illustrator', 'Photoshop', 'InDesign', 'Branding', 'Typography'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'sbu.radebe@example.co.za', 'Sbu', 'Radebe', '+27 31 345 6789', 'Network Engineer', 'Network engineer with CCNA certification managing enterprise networks.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Cisco', 'Networking', 'VPN', 'Firewalls', 'Network Security'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'zama.zwane@example.co.za', 'Zama', 'Zwane', '+27 12 456 7890', 'Sales Manager', 'Sales professional with proven track record in B2B software sales.', 'Pretoria, Gauteng', 'ZA', ARRAY['B2B Sales', 'Salesforce', 'Negotiation', 'Lead Generation', 'Account Management'], 6, 'approved', 100, true),
  (gen_random_uuid(), 'katlego.modise@example.co.za', 'Katlego', 'Modise', '+27 41 567 8901', 'Accountant', 'Chartered accountant specializing in financial reporting and tax compliance.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Financial Reporting', 'Tax', 'Audit', 'Excel', 'SAP'], 7, 'approved', 100, true),
  (gen_random_uuid(), 'tshepo.motaung@example.co.za', 'Tshepo', 'Motaung', '+27 11 678 9012', 'AI/ML Engineer', 'Machine learning engineer building intelligent systems. Masters in AI.', 'Johannesburg, Gauteng', 'ZA', ARRAY['PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Python'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'noluthando.gumede@example.co.za', 'Noluthando', 'Gumede', '+27 21 789 0123', 'Legal Advisor', 'Corporate lawyer specializing in commercial contracts and compliance.', 'Cape Town, Western Cape', 'ZA', ARRAY['Contract Law', 'Compliance', 'Legal Research', 'Negotiation', 'Corporate Law'], 8, 'approved', 100, true),
  (gen_random_uuid(), 'lebo.mashaba@example.co.za', 'Lebo', 'Mashaba', '+27 31 890 1234', 'Video Editor', 'Video editor creating engaging content for digital platforms.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Premiere Pro', 'After Effects', 'Video Editing', 'Motion Graphics', 'Color Grading'], 3, 'approved', 100, true),
  (gen_random_uuid(), 'thulani.khoza@example.co.za', 'Thulani', 'Khoza', '+27 12 901 2345', 'Electrical Engineer', 'Electrical engineer with experience in power systems and renewable energy.', 'Pretoria, Gauteng', 'ZA', ARRAY['Electrical Design', 'AutoCAD', 'Power Systems', 'Solar Energy', 'Project Management'], 9, 'approved', 100, true),
  (gen_random_uuid(), 'busisiwe.zwane@example.co.za', 'Busisiwe', 'Zwane', '+27 41 012 3456', 'Customer Success Manager', 'Customer success professional ensuring client satisfaction and retention.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Customer Success', 'Salesforce', 'Onboarding', 'Retention', 'Communication'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'sandile.nkomo@example.co.za', 'Sandile', 'Nkomo', '+27 11 123 4567', 'Blockchain Developer', 'Blockchain developer building decentralized applications on Ethereum.', 'Johannesburg, Gauteng', 'ZA', ARRAY['Solidity', 'Ethereum', 'Web3', 'Smart Contracts', 'JavaScript'], 3, 'approved', 100, true),
  
  -- Profile 31-40
  (gen_random_uuid(), 'palesa.mokoena@example.co.za', 'Palesa', 'Mokoena', '+27 21 234 5678', 'SEO Specialist', 'SEO expert helping businesses rank higher in search results.', 'Cape Town, Western Cape', 'ZA', ARRAY['SEO', 'Google Analytics', 'Keyword Research', 'Link Building', 'Content Strategy'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'jabu.mnguni@example.co.za', 'Jabu', 'Mnguni', '+27 31 345 6789', 'Mechanical Engineer', 'Mechanical engineer with CAD expertise and manufacturing experience.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['CAD', 'SolidWorks', 'Manufacturing', 'Design', 'Project Management'], 7, 'approved', 100, true),
  (gen_random_uuid(), 'nomhle.dlomo@example.co.za', 'Nomhle', 'Dlomo', '+27 12 456 7890', 'Social Media Manager', 'Social media manager creating engaging campaigns across platforms.', 'Pretoria, Gauteng', 'ZA', ARRAY['Social Media Strategy', 'Content Creation', 'Analytics', 'Community Management', 'Facebook Ads'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'thabiso.mthembu@example.co.za', 'Thabiso', 'Mthembu', '+27 41 567 8901', 'Supply Chain Manager', 'Supply chain professional optimizing logistics and inventory management.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Supply Chain', 'Logistics', 'SAP', 'Inventory Management', 'Procurement'], 8, 'approved', 100, true),
  (gen_random_uuid(), 'rethabile.molefe@example.co.za', 'Rethabile', 'Molefe', '+27 11 678 9012', 'Technical Writer', 'Technical writer creating clear documentation for software products.', 'Johannesburg, Gauteng', 'ZA', ARRAY['Technical Writing', 'Documentation', 'API Documentation', 'Markdown', 'User Guides'], 3, 'approved', 100, true),
  (gen_random_uuid(), 'sizwe.ndaba@example.co.za', 'Sizwe', 'Ndaba', '+27 21 789 0123', 'Game Developer', 'Game developer creating immersive experiences with Unity and Unreal Engine.', 'Cape Town, Western Cape', 'ZA', ARRAY['Unity', 'C#', 'Game Design', '3D Modeling', 'Unreal Engine'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'bontle.kekana@example.co.za', 'Bontle', 'Kekana', '+27 31 890 1234', 'Financial Analyst', 'Financial analyst providing insights for strategic business decisions.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Financial Modeling', 'Excel', 'Power BI', 'Forecasting', 'Analytics'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'thato.mokhele@example.co.za', 'Thato', 'Mokhele', '+27 12 901 2345', 'UI Developer', 'UI developer specializing in creating pixel-perfect interfaces.', 'Pretoria, Gauteng', 'ZA', ARRAY['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Responsive Design'], 3, 'approved', 100, true),
  (gen_random_uuid(), 'nonhlanhla.sithole@example.co.za', 'Nonhlanhla', 'Sithole', '+27 41 012 3456', 'Brand Manager', 'Brand manager building and maintaining strong brand identities.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Brand Strategy', 'Marketing', 'Brand Identity', 'Campaign Management', 'Market Research'], 6, 'approved', 100, true),
  (gen_random_uuid(), 'khaya.ngubane@example.co.za', 'Khaya', 'Ngubane', '+27 11 123 4567', 'IoT Developer', 'IoT developer connecting devices and building smart solutions.', 'Johannesburg, Gauteng', 'ZA', ARRAY['IoT', 'Arduino', 'Raspberry Pi', 'MQTT', 'Python'], 4, 'approved', 100, true),
  
  -- Profile 41-50
  (gen_random_uuid(), 'dineo.mabuza@example.co.za', 'Dineo', 'Mabuza', '+27 21 234 5678', 'Marketing Manager', 'Marketing manager with integrated marketing campaign experience.', 'Cape Town, Western Cape', 'ZA', ARRAY['Marketing Strategy', 'Campaign Management', 'Budget Management', 'Team Leadership', 'Analytics'], 7, 'approved', 100, true),
  (gen_random_uuid(), 'bheki.hadebe@example.co.za', 'Bheki', 'Hadebe', '+27 31 345 6789', 'Civil Engineer', 'Civil engineer specializing in infrastructure and construction projects.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Civil Engineering', 'AutoCAD', 'Project Management', 'Structural Design', 'Site Management'], 10, 'approved', 100, true),
  (gen_random_uuid(), 'refilwe.mabena@example.co.za', 'Refilwe', 'Mabena', '+27 12 456 7890', 'E-commerce Manager', 'E-commerce manager driving online sales and customer experience.', 'Pretoria, Gauteng', 'ZA', ARRAY['E-commerce', 'Shopify', 'Digital Marketing', 'Analytics', 'Conversion Optimization'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'musa.sibiya@example.co.za', 'Musa', 'Sibiya', '+27 41 567 8901', 'Training Coordinator', 'Training professional designing and delivering employee development programs.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Training', 'Instructional Design', 'LMS', 'Employee Development', 'Facilitation'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'thembeka.zungu@example.co.za', 'Thembeka', 'Zungu', '+27 11 678 9012', 'BI Developer', 'Business intelligence developer creating data warehouses and dashboards.', 'Johannesburg, Gauteng', 'ZA', ARRAY['SQL', 'Power BI', 'Tableau', 'Data Warehousing', 'ETL'], 6, 'approved', 100, true),
  (gen_random_uuid(), 'mlungisi.zondo@example.co.za', 'Mlungisi', 'Zondo', '+27 21 789 0123', 'IT Support Specialist', 'IT support specialist providing technical assistance and troubleshooting.', 'Cape Town, Western Cape', 'ZA', ARRAY['IT Support', 'Help Desk', 'Windows', 'Active Directory', 'Troubleshooting'], 3, 'approved', 100, true),
  (gen_random_uuid(), 'mbalenhle.madonsela@example.co.za', 'Mbalenhle', 'Madonsela', '+27 31 890 1234', 'Interior Designer', 'Interior designer creating functional and beautiful spaces.', 'Durban, KwaZulu-Natal', 'ZA', ARRAY['Interior Design', 'AutoCAD', 'SketchUp', '3D Rendering', 'Space Planning'], 5, 'approved', 100, true),
  (gen_random_uuid(), 'kabelo.moyo@example.co.za', 'Kabelo', 'Moyo', '+27 12 901 2345', 'Robotics Engineer', 'Robotics engineer developing autonomous systems and automation solutions.', 'Pretoria, Gauteng', 'ZA', ARRAY['Robotics', 'ROS', 'Python', 'C++', 'Computer Vision'], 4, 'approved', 100, true),
  (gen_random_uuid(), 'zanele.masango@example.co.za', 'Zanele', 'Masango', '+27 41 012 3456', 'Public Relations Specialist', 'PR specialist managing media relations and corporate communications.', 'Port Elizabeth, Eastern Cape', 'ZA', ARRAY['Public Relations', 'Media Relations', 'Crisis Management', 'Press Releases', 'Communications'], 6, 'approved', 100, true),
  (gen_random_uuid(), 'ndumiso.ndhlovu@example.co.za', 'Ndumiso', 'Ndhlovu', '+27 11 123 4567', 'Solutions Architect', 'Solutions architect designing end-to-end technical solutions for enterprise clients.', 'Johannesburg, Gauteng', 'ZA', ARRAY['Solution Design', 'Enterprise Architecture', 'Cloud', 'Integration', 'Technical Leadership'], 11, 'approved', 100, true)
ON CONFLICT (user_id) DO NOTHING;

-- Note: In a real implementation, you would:
-- 1. Create actual user accounts via Supabase Auth (email/password or OAuth)
-- 2. The trigger would automatically create profile records
-- 3. Then populate additional profile fields via API calls
-- 4. Finally, create jobseeker_profiles entries for verified users

-- This SQL is for demonstration purposes showing the data structure
