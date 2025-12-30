# AI Job Matcher - UI/UX Documentation

## Page Structure

### URL: `/job-matcher`

## Section 1: Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    🌟 Powered by AI                            │
│                                                                 │
│         Find Your Perfect Job with AI Matching                 │
│                                                                 │
│    Upload your resume and let our AI-powered job matcher       │
│    find opportunities that perfectly align with your skills,   │
│    experience, and career goals. Get automatic applications    │
│    and real-time notifications.                                │
│                                                                 │
│    ✓ AI-Powered Matching  ✓ Smart Notifications  ✓ Auto-Apply │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Section 2: Main Content (Tabbed Interface)

### Tab Bar
```
┌─────────────────────────────────────────────────────────────────┐
│  [Upload Resume] [Preferences] [Matches (5)] [Auto-Apply]      │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 1: Upload Resume
```
┌─────────────────────────────────────────────────────────────────┐
│  Upload Your Resume                                             │
│  Upload your resume or CV to get started with AI-powered       │
│  job matching                                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              📤 Drag & drop your resume here            │   │
│  │         or click to browse (PDF, DOC, DOCX - max 5MB)  │   │
│  │                                                         │   │
│  │              [Choose File] Button                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Resume Text (for AI analysis)                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Paste your resume text here for AI-powered parsing...  │   │
│  │                                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Parse Resume with AI] Button (full width)                    │
│                                                                 │
│  ✓ Resume Parsed Successfully                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Name: John Doe                                          │   │
│  │ Skills: React, TypeScript, Node.js, Python             │   │
│  │ Experience: 5 years                                     │   │
│  │ Recent Position: Senior Developer at Tech Corp         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 2: Job Preferences
```
┌─────────────────────────────────────────────────────────────────┐
│  Job Preferences                                                │
│  Set your job preferences to receive better matches            │
│                                                                 │
│  Preferred Job Titles                                          │
│  [Software Engineer        ] [+]                               │
│  [Software Engineer] [Senior Developer] [x] [x]                │
│                                                                 │
│  Preferred Locations                                           │
│  [Cape Town                ] [+]                               │
│  [Cape Town] [Johannesburg] [x] [x]                           │
│                                                                 │
│  Remote Preference                                             │
│  [Any ▼]                                                       │
│                                                                 │
│  Salary Range                                                  │
│  Minimum (ZAR/month)    Maximum (ZAR/month)                   │
│  [30000              ]  [80000              ]                  │
│                                                                 │
│  Preferred Industries                                          │
│  [Technology           ] [+]                                   │
│  [Technology] [FinTech] [x] [x]                               │
│                                                                 │
│  Job Types                                                     │
│  [Full-time] [Part-time] [Contract] [Freelance] [Internship] │
│  (Full-time and Contract selected/highlighted)                 │
│                                                                 │
│  Notification Frequency                                        │
│  [Daily Digest ▼]                                             │
│                                                                 │
│  [Save Preferences] Button (full width)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 3: Matches
```
┌─────────────────────────────────────────────────────────────────┐
│  Your Job Matches                    [Refresh Matches] Button   │
│  AI-powered matches based on your resume and preferences        │
│                                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │   Total  │Excellent │   Good   │   New    │ Applied  │      │
│  │    27    │    8     │    12    │    15    │    3     │      │
│  │ Matches  │  (90+%)  │ (70-89%) │          │          │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                                 │
│  🎚️ Filters & Search                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Search         Sort By      Status      Min Score: 70%  │   │
│  │ [🔍 Job...]   [Score ▼]    [All ▼]    [────────●───]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Showing 27 of 27 matches                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Senior React Developer        [95% Excellent Match]     │   │
│  │ TechCorp Solutions                                      │   │
│  │                                                         │   │
│  │ 📍 Cape Town  💼 Full-time  💰 R50,000-R80,000  🕒 2d  │   │
│  │                                                         │   │
│  │ Why this matches:                                      │   │
│  │ Skills matched: React, TypeScript, Node.js, AWS, Docker│   │
│  │ Experience: Your 5 years aligns perfectly              │   │
│  │ "Excellent match based on senior-level React expertise"│   │
│  │                                                         │   │
│  │ Required Skills:                                       │   │
│  │ [React] [TypeScript] [Node.js] [AWS] [Docker] +3 more │   │
│  │                                                         │   │
│  │ [👁️ View Details] [🔖] [Apply Now] [🔗]               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Full Stack Developer          [88% Good Match]         │   │
│  │ Innovation Labs                                         │   │
│  │                                                         │   │
│  │ 📍 Remote  💼 Contract  💰 From R60,000  🕒 1w         │   │
│  │                                                         │   │
│  │ Why this matches:                                      │   │
│  │ Skills matched: React, Python, PostgreSQL, Git         │   │
│  │ Experience: Strong alignment with requirements         │   │
│  │ "Good fit with remote work preference"                 │   │
│  │                                                         │   │
│  │ [👁️ View Details] [🔖] [Apply Now] [🔗]               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 4: Auto-Apply
```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ Auto-Apply Settings                       [Premium]         │
│  Automatically apply to jobs that match your criteria          │
│                                                                 │
│  ℹ️ Auto-apply will automatically submit applications to jobs  │
│     that meet your minimum match score threshold.              │
│                                                                 │
│  Enable Auto-Apply                                   [Toggle]  │
│  Automatically apply to jobs that match your preferences       │
│                                                                 │
│  Minimum Match Score: 80%                                      │
│  Only apply to jobs with a match score of 80% or higher       │
│  [────────────●──────────] [80]                                │
│  More jobs              Better matches                         │
│                                                                 │
│  Cover Letter Template            [Use Default Template]       │
│  Use placeholders: [JOB_TITLE], [COMPANY_NAME], [YOUR_NAME]   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Dear Hiring Manager,                                    │   │
│  │                                                         │   │
│  │ I am writing to express my strong interest in the      │   │
│  │ [JOB_TITLE] position at [COMPANY_NAME]...              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  💡 AI Enhancement: Our AI will customize this template for    │
│     each job application, highlighting your most relevant      │
│     skills and experience for that specific role.              │
│                                                                 │
│  [Save Settings] Button (full width)                           │
│                                                                 │
│  Recent Auto-Applications                                      │
│  No auto-applications yet. Applications will appear here       │
│  once you enable this feature.                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Match Score Colors
- **90-100% (Excellent)**: Green badge with white text
- **70-89% (Good)**: Blue badge with white text
- **50-69% (Fair)**: Yellow badge with dark text
- **0-49% (Low)**: Gray badge with white text

### Component Colors
- **Primary**: Brand color (likely blue/purple)
- **Secondary**: Muted gray
- **Success**: Green
- **Warning**: Yellow/Orange
- **Destructive**: Red
- **Muted**: Light gray background

## Interactive Elements

### Buttons
- **Primary**: Filled with primary color
- **Secondary**: Outlined
- **Ghost**: Transparent with hover effect
- **Icon**: Small icon-only buttons

### Form Elements
- **Input**: Bordered with focus ring
- **Select**: Dropdown with chevron
- **Slider**: Track with draggable thumb
- **Switch**: Toggle with smooth transition
- **Textarea**: Multi-line with monospace font for templates

### Cards
- **Job Match Cards**: White background, shadow on hover
- **Stat Cards**: Compact with large numbers
- **Settings Cards**: Grouped form elements

### Badges
- **Skill Badges**: Rounded pills
- **Status Badges**: Colored indicators
- **Score Badges**: Large prominent displays

## Responsive Behavior

### Desktop (>768px)
- Full navigation menu
- Multi-column layouts (stats grid)
- Side-by-side form fields
- Expanded job cards

### Mobile (<768px)
- Hamburger menu
- Single column layouts
- Stacked form fields
- Compact job cards
- Tab labels abbreviated

## Loading States
- Skeleton screens for cards
- Spinner icons for buttons
- Progress bars for uploads
- Shimmer effects for lists

## Empty States
- "No matches yet" message
- "Upload resume to start" prompt
- "Enable auto-apply" placeholder
- Helpful icons and descriptions

## Accessibility
- Proper ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader friendly
- Color contrast compliance

## Animations
- Smooth tab transitions
- Fade-in for loaded content
- Slide-in for cards
- Button hover effects
- Toast notifications

## Navigation Flow

1. **First Visit**: Upload Resume → Parse → See results
2. **Set Preferences**: Fill form → Save → Auto-match
3. **Browse Matches**: Filter → Sort → View details
4. **Apply**: Quick apply or auto-apply
5. **Track**: Check status in dashboard

## Key User Actions

### Primary Actions (Most Important)
- Parse Resume with AI
- Save Preferences
- Apply Now
- Refresh Matches

### Secondary Actions
- View Details
- Save/Bookmark
- Enable Auto-Apply
- Filter Matches

### Tertiary Actions
- External Link
- Change Settings
- Dismiss Match

## Success Indicators
- ✓ Resume Parsed Successfully (green checkmark)
- Toast: "Profile updated successfully"
- Toast: "Found 27 matching jobs!"
- Toast: "Application submitted!"
- Badge: "Applied" status on cards

## Design System
- **Fonts**: Plus Jakarta Sans (from existing design)
- **Spacing**: 4px, 8px, 16px, 24px, 32px
- **Border Radius**: 8px for cards, 4px for buttons
- **Shadows**: Subtle elevation on hover
- **Icons**: Lucide React icon set

---

## UI Component Hierarchy

```
JobMatcher (Page)
├── SEOHead
├── Navbar (existing)
├── Hero Section
│   ├── Badge (Powered by AI)
│   ├── Heading
│   ├── Description
│   └── Feature List (checkmarks)
├── Tabs Container
│   ├── TabsList
│   │   ├── Upload Resume Tab
│   │   ├── Preferences Tab
│   │   ├── Matches Tab (with badge count)
│   │   └── Auto-Apply Tab
│   ├── Tab Content: Upload
│   │   └── ResumeUploader
│   │       ├── Upload Area (drag-drop)
│   │       ├── Text Area (resume text)
│   │       ├── Parse Button
│   │       └── Parsed Data Display
│   ├── Tab Content: Preferences
│   │   └── JobPreferencesForm
│   │       ├── Job Titles Input + Tags
│   │       ├── Locations Input + Tags
│   │       ├── Remote Select
│   │       ├── Salary Inputs
│   │       ├── Industries Input + Tags
│   │       ├── Job Types Badges
│   │       ├── Notification Select
│   │       └── Save Button
│   ├── Tab Content: Matches
│   │   ├── Header (title + refresh button)
│   │   ├── Stats Cards Grid
│   │   ├── Filters Card
│   │   │   ├── Search Input
│   │   │   ├── Sort Select
│   │   │   ├── Status Select
│   │   │   └── Score Slider
│   │   └── MatchedJobsList
│   │       └── MatchedJobCard (repeated)
│   │           ├── Header (title + score badge)
│   │           ├── Job Details Grid
│   │           ├── Match Reasons
│   │           ├── Skills Badges
│   │           ├── Status Badge
│   │           └── Action Buttons
│   └── Tab Content: Auto-Apply
│       └── AutoApplySettings
│           ├── Info Alert
│           ├── Enable Toggle
│           ├── Score Slider
│           ├── Template Textarea
│           ├── Enhancement Alert
│           ├── Save Button
│           └── History Section
└── Footer (existing)
```

This structure provides a complete visual and functional overview of the AI Job Matcher feature!
