# User Profile & Jobseeker Database Enhancement - Implementation Guide

## Overview

This implementation adds comprehensive enhancements to the Jobbyist platform, including:
- Enhanced user profile dashboard with resume/CV uploads
- Email verification system
- Upskilling program tracking
- Jobseeker profiles database with premium access control
- Subscription management
- Follow/following system
- Direct messaging between users

## Database Schema

### New Tables

#### 1. `subscriptions`
Manages user subscriptions for premium features.

```sql
- subscription_type: 'jobseeker_pro' | 'recruitment_suite'
- plan_tier: 'free' | 'basic' | 'premium' | 'enterprise'
- status: 'active' | 'cancelled' | 'expired' | 'trial'
- expires_at: Timestamp for subscription expiry
```

#### 2. `upskilling_programs`
Stores available upskilling programs.

```sql
- name, slug, description
- category, level, duration_weeks
- skills: Array of skills taught
- is_active: Boolean
```

#### 3. `upskilling_enrollments`
Tracks user enrollments in upskilling programs.

```sql
- user_id, program_id
- progress: Integer (0-100)
- completed: Boolean
```

#### 4. `jobseeker_profiles`
Public-facing verified jobseeker profiles.

```sql
- profile_id: Reference to profiles table
- is_public, is_searchable, available_for_hire
- expected_salary_min, expected_salary_max
- views_count: Track profile views
```

#### 5. `follows`
User follow relationships.

```sql
- follower_id, following_id
- Unique constraint on (follower_id, following_id)
- Check: Cannot follow yourself
```

#### 6. `conversations`
Direct message conversations between users.

```sql
- participant1_id, participant2_id
- last_message_at: Timestamp of last message
```

#### 7. `messages`
Messages within conversations.

```sql
- conversation_id, sender_id
- content: Message text
- is_read, read_at: Read tracking
```

## Access Control & RLS Policies

### Premium Features
- **Full profile access**: Requires active 'recruitment_suite' subscription
- **Direct messaging**: Requires premium subscription AND mutual following
- **Resume downloads**: Premium only

### Row Level Security
All tables have RLS enabled with appropriate policies:
- Users can view their own data
- Admins have full access
- Public profiles are viewable by all
- Conversations/messages restricted to participants

## Frontend Components

### Pages
- `/profile` - Enhanced user profile dashboard
- `/jobseekers` - Jobseeker profiles listing
- `/jobseekers/:id` - Individual jobseeker detail page

### Hooks
- `useProfile()` - Profile management with resume/avatar uploads
- `useUpskilling()` - Upskilling program enrollment and progress
- `useSubscription()` - Subscription status and checks
- `useFollows()` - Follow/unfollow functionality
- `useMessaging()` - Real-time messaging with Supabase subscriptions

### Components
- `MessagingComponent` - Full-featured chat interface
- Profile strength indicator
- Email verification alert
- Upskilling progress cards

## Key Features

### 1. Resume/CV Upload
- Stored in private Supabase storage bucket
- Max 5MB size limit
- Supports PDF, DOC, DOCX formats
- Uses signed URLs for secure access

### 2. Profile Picture Upload
- Stored in public Supabase storage bucket
- Max 2MB size limit
- Automatic public URL generation

### 3. Email Verification
- Resend verification email button
- Alert shown for unverified users
- Integrated with Supabase Auth

### 4. Profile Strength
- Calculated automatically via database trigger
- 10-point scale converted to percentage
- Visual indicator (Weak/Fair/Good/Strong/Complete)

### 5. Upskilling Progress
- 8 default programs (Frontend, Backend, Data Science, etc.)
- Progress tracking (0-100%)
- Completion badges
- Skills earned display

### 6. Jobseeker Profiles
- Public listing with search
- Premium vs. free access levels
- Profile view tracking
- Verified badge for approved profiles

### 7. Direct Messaging
- Real-time chat with Supabase subscriptions
- Message read status
- Only available between mutual followers with premium
- Clean, modern chat interface

### 8. Follow System
- Follow/unfollow with single click
- Follower counts
- Required for direct messaging
- Prevents self-following

## Access Levels

### Free Users (Non-logged in)
- View partial jobseeker profiles
- See limited skills (3 max)
- No contact information
- No resume access

### Registered Users (Free)
- View own profile
- Upload resume/CV and avatar
- Enroll in upskilling programs
- Follow other users

### Premium Users (Jobseeker Pro or Recruitment Suite)
- Full jobseeker profile access
- View contact information
- Download resumes
- Direct messaging (with mutual follows)
- Priority search placement

## Migration Files

1. `20260120000000_add_enhanced_features.sql`
   - Creates all new tables
   - Sets up RLS policies
   - Adds helper functions
   - Seeds 8 upskilling programs

2. `20260120000001_seed_jobseeker_profiles.sql`
   - Contains 50 South African jobseeker profile templates
   - Note: Requires actual auth users to be created first
   - Reference implementation only

## Setup Instructions

### 1. Database Migration
Run the migrations in order:
```bash
# Apply migrations via Supabase CLI or dashboard
supabase db push
```

### 2. Storage Buckets
Buckets are automatically created by the first migration:
- `resumes` (private)
- `avatars` (public)

### 3. Seeding Data
The upskilling programs are auto-seeded. For jobseeker profiles:
1. Create auth users via Supabase Auth
2. Profiles are auto-created via trigger
3. Manually update profile fields or use admin panel

### 4. Environment Variables
No new environment variables required. Uses existing Supabase configuration.

## Testing

### Manual Testing Checklist
- [ ] Upload resume (PDF, DOC)
- [ ] Upload profile picture
- [ ] Send verification email
- [ ] View profile strength indicator
- [ ] Enroll in upskilling program
- [ ] Update enrollment progress
- [ ] Search jobseeker profiles
- [ ] View jobseeker detail (free vs premium)
- [ ] Follow/unfollow user
- [ ] Send direct message (premium + mutual follow)
- [ ] Receive real-time messages

### Security Testing
- [ ] RLS prevents unauthorized data access
- [ ] Premium checks enforce access control
- [ ] Cannot message without mutual follow
- [ ] Cannot view private data without premium
- [ ] Storage policies prevent unauthorized uploads

## Known Limitations

1. **Seed Data**: The jobseeker profile seed requires manual user creation first
2. **Payment Integration**: Subscription management UI exists but payment gateway not integrated
3. **Email Templates**: Uses default Supabase email templates
4. **File Types**: Limited to PDF/DOC/DOCX for resumes
5. **Real-time Scale**: Messaging subscription may need optimization for high user counts

## Future Enhancements

1. Stripe/PayFast payment integration for subscriptions
2. Bulk user import for jobseeker profiles
3. Advanced search filters (location, salary range, skills)
4. Notification system for new messages/follows
5. Message attachments and file sharing
6. Video call integration for recruiters
7. AI-powered profile matching
8. Certificate/badge system for completed programs

## Support & Troubleshooting

### Common Issues

**Q: Resume upload fails**
A: Check file size (<5MB) and format (PDF/DOC/DOCX). Verify storage bucket permissions.

**Q: Can't send messages**
A: Ensure both users have premium subscriptions and follow each other.

**Q: Profile strength not updating**
A: The trigger updates on profile UPDATE. Save your profile to recalculate.

**Q: Seed data fails**
A: The seed data is a reference template. Create auth users first, then populate profiles.

## Architecture Decisions

### Why Supabase Storage?
- Built-in auth integration
- RLS for secure access
- Signed URLs for private content
- No third-party dependencies

### Why Real-time Subscriptions?
- Native Supabase feature
- Low latency messaging
- Automatic reconnection
- Scales with Supabase infrastructure

### Why Separate Jobseeker Profiles Table?
- Separates verified public profiles from private profiles
- Allows independent access control
- Better performance for public queries
- Easy to add profile-specific features

## License

MIT License - See repository LICENSE file for details.

## Contributors

- GitHub Copilot Coding Agent
- Jobbyist Team

---

Last Updated: January 20, 2026
Version: 1.0.0
