# AI-DS Academy Frontend Platform Blueprint

This document describes the frontend, user interface, visual system, components, layouts, and user experience of the AI-DS Academy learning platform. It is written as a replication blueprint for creating a similar platform for a different purpose. Backend implementation, database structure, server logic, and API internals are intentionally excluded.

## 1. Product Shape

AI-DS Academy is a dark, futuristic learning management platform with two major experiences:

- Public experience: landing page, login, registration, certificate verification, error pages.
- Student portal: dashboard, course catalog, course learning workspace, tests, certificates, leaderboard, profile.
- Admin portal: dashboard, course management, student management, certificate management, activity log, leaderboard.

The product feels like a modern AI learning platform: dense enough for real work, but visually premium through glass cards, gradients, animated backgrounds, icon-led controls, progress charts, and achievement-style feedback.

## 2. Frontend Stack

- Framework: Next.js App Router with React client components.
- Styling: Tailwind CSS with custom theme extensions.
- Icons: Lucide React.
- Animation: Framer Motion.
- Charts: Recharts.
- Mind map: React Flow.
- Toasts: React Hot Toast.
- Certificate export visuals: HTML-rendered certificate component with PDF download interaction.

## 3. Visual Identity

### Brand Feel

The UI should communicate:

- Advanced technology.
- AI-assisted learning.
- Trust and certification.
- Progress, achievement, and momentum.
- Dark premium dashboard aesthetic.

### Core Color Palette

Primary background colors:

- `#050508` main dark background.
- `#0A0A12` secondary dark surface.
- `#0D0D1A` deeper dashboard surface.
- `#131325` elevated dark panel.
- `#1A1A30` toast and high-elevation panel surface.

Primary accent colors:

- Purple `#7C3AED`
- Purple hover `#8B5CF6`
- Soft purple `#A78BFA`
- Cyan `#06B6D4`
- Cyan bright `#22D3EE`

Status colors:

- Green for complete, verified, passed.
- Amber/yellow for certificate, pending, prize, warning.
- Red for revoked, failed, invalid, destructive actions.
- Zinc/slate for draft, neutral, unavailable.

### Gradients

Common gradients:

- Brand icon: purple to cyan.
- Text highlight: purple to light purple to cyan.
- Hero background: deep black/purple/cyan radial glow.
- Course categories: per-category gradient bars.
- Progress bars: purple to cyan, green to emerald, amber to orange.
- Certificate theme: dark navy with gold ornamentation.

### Typography

- Main font: Inter or a similar clean sans-serif.
- Display font: Space Grotesk style is referenced in theme, though current global font loads Inter. A replica can use Space Grotesk for headings and Inter for body.
- Heading style: bold, geometric, often with gradient text.
- Body text: mostly white with opacity levels:
  - Primary: white.
  - Secondary: `white/60`.
  - Muted: `white/40`.
  - Disabled: `white/20` to `white/30`.

### Shape Language

- Cards: rounded-xl to rounded-2xl.
- Login card and logo: rounded-3xl.
- Buttons: rounded-xl.
- Badges: rounded-full.
- Avatars: rounded-full or rounded-xl depending context.
- Certificate: sharp ornamental border inside a rectangular certificate canvas.

### Surface Language

Use glassmorphism heavily:

- `bg-white/[0.03]`
- `backdrop-blur-sm`
- `border border-white/[0.06]`
- hover surface: `bg-white/[0.06]`
- accent border on active elements: purple/cyan/green/amber.

Reusable visual classes:

- `glass-card`: translucent dark card.
- `glass-card-hover`: card with hover surface and purple border.
- `gradient-text`: purple-to-cyan text.
- `btn-primary`: purple gradient button with hover shadow.
- `btn-secondary`: translucent bordered button.
- `input-field`: dark glass input with purple focus border.
- `gradient-border`: transparent border using purple/cyan gradient.
- `grid-pattern`: subtle purple grid background.
- `neon-line`: horizontal purple/cyan divider.
- `badge-purple`, `badge-cyan`, `badge-green`, `badge-red`.

## 4. Global UI Behaviors

### Loading

Loading states use centered Lucide `Loader2` icons with purple color and spin animation. Larger dashboard sections use shimmer cards.

### Toasts

Toasts appear top-right with:

- Background `#1A1A30`
- White text
- Purple border
- Rounded 12px
- Purple success icon theme
- Red error icon theme

### Animation

Framer Motion is used for:

- Page section entrance.
- Cards fading/sliding in.
- Login hero logo hover and pulse.
- Leaderboard podium entrance.
- Certificate expansion.
- Modals.
- Floating particles and scan lines.

CSS animation is used for:

- Particle float.
- Shimmer loading.
- Progress bar fill.
- Pulse glow.
- Gradient motion.

## 5. Public Website

### Landing Page

Purpose: Sell the platform and route users to login/register.

Layout:

- Full-screen dark background with fixed animated grid, blurred purple/cyan blobs, and floating particles.
- Top navbar with brand icon, brand name, Sign In, Get Started.
- Centered hero with badge, large gradient headline, supporting copy, and two CTAs.
- Stats strip with four glass cards.
- Feature grid.
- Learning journey visual.
- CTA card.
- Footer.

Components:

- Brand mark: square rounded gradient icon containing Brain icon.
- Badge: "Powered by Cerebras AI" style with Sparkles icon.
- Hero headline: large display text, gradient-highlighted product subject.
- CTA buttons: primary with PlayCircle, secondary with ChevronRight.
- Stats cards: number and label.
- Feature cards: icon tile, title, description, individual accent colors.
- Learning journey steps: Watch Videos, Take Module Test, Unlock Next Module, Get Certificate.
- Neon divider.
- Footer brand row.

Replication notes:

- Replace AI/Data Science wording with the new platform domain.
- Keep the hero as direct product positioning, not a generic landing page.
- Keep feature cards tied to real platform capabilities.

### Login Page

Purpose: Premium animated authentication entry.

Visual style:

- Rich radial dark gradient background.
- Purple grid overlay and dot intersections.
- Multiple blurred color blobs.
- Floating particles.
- Moving horizontal scan lines.
- Desktop orbiting icons around the login card.
- Centered logo and login card.

Components:

- Large rounded brand icon with animated glow.
- Product title and subtitle.
- Login card with glowing top edges.
- Email input with Mail icon.
- Password input with Lock icon and Eye/EyeOff toggle.
- Primary Sign In button with loading spinner.
- Register link.
- Footer hint row: AI-Powered, Certified Courses, Learn & Grow.

UX:

- Email/password form.
- Inline validation through toast messages.
- Button shows spinner while submitting.
- Password visibility toggle.

### Register Page

Purpose: Two-step account creation with phone OTP verification.

Layout:

- Centered glass card.
- Dark grid background with purple/cyan glows.
- Logo and title above card.
- Step indicator at top of card.

Step 1 components:

- Full Name input with User icon.
- Email input with Mail icon.
- Password input with Lock icon and visibility toggle.
- Phone number input with fixed `+91` prefix.
- Send OTP primary button.

Step 2 components:

- OTP sent badge.
- Demo OTP preview card, if available.
- Centered OTP input with mono font and large tracking.
- Verify & Create Account button.
- Change Details secondary button.

UX:

- Enforces all required fields visually.
- Phone input allows only digits and max 10.
- Password has minimum character expectation.
- Step indicator clearly shows "Your Details" and "Verify OTP".

### Certificate Verification Page

Purpose: Public certificate lookup and trust screen.

Layout:

- Centered max-width verification panel.
- Header badge: Certificate Verification.
- Brand title and subtitle.
- Loading verification card.
- Result card with status-specific border.

States:

- Loading: spinner and "Verifying certificate..."
- Not found: red icon, title, explanation.
- Verified: green status banner.
- Pending: amber status banner.
- Revoked: red status banner with reason.

Certificate detail components:

- Student name row with User icon.
- Course completed row with BookOpen icon.
- Issued date row with Calendar icon.
- Certificate ID row with Hash icon.

### Error Pages

404 and 500 pages use:

- Full-screen dark background.
- Large gradient status code.
- Clear title.
- Muted explanatory text.
- Purple primary link or action.
- 500 includes Try Again and Go Home.

## 6. Shared Portal Layouts

### Student Layout

Structure:

- Fixed left sidebar on desktop.
- Mobile sticky header with menu button.
- Sidebar overlay on mobile.
- Main content area with max width.

Sidebar components:

- Brand header: icon, AI-DS Academy, "Student Portal".
- Navigation links:
  - Dashboard
  - My Courses
  - Leaderboard
  - Certificates
  - My Profile
- Active item: purple translucent background, purple text, border, trailing ChevronRight.
- User card with avatar initial and Student badge.
- Sign Out button.

Special behavior:

- Course detail pages auto-collapse the sidebar to maximize learning workspace.

### Admin Layout

Structure mirrors student layout with admin-specific navigation.

Admin navigation:

- Dashboard
- Courses
- Students
- Certificates
- Activity Log
- Leaderboard

Sidebar components:

- Brand header with "Admin Panel".
- Active state same as student.
- Admin user card with purple badge.
- Logout button with red hover treatment.

## 7. Student Experience

### Student Dashboard

Purpose: Personalized learning home and analytics overview.

Major UI sections:

- Welcome hero card.
- Continue learning banner.
- Stat cards.
- Learning insight cards.
- Performance analytics charts.
- My Courses preview.
- Certificates strip.
- Recent activity timeline.
- Empty-state CTA.

Welcome hero:

- Gradient dark card with purple/cyan glow blobs.
- Greeting based on time.
- Personalized name with gradient text.
- Circular progress ring on desktop.
- Mobile progress bar.

Continue learning banner:

- Cyan/purple gradient band.
- PlayCircle icon tile.
- Course title.
- Module completion count.
- Resume or Start action.
- Thin progress bar.

Stats row:

- Enrolled courses.
- Completed modules.
- Finished courses.
- Certificates earned.

Learning insights:

- Average test score circular ring.
- Learning DNA category chips.
- Module completion bars for videos watched and tests passed.

Analytics:

- Bar chart: test scores by module.
- Radial chart: overall course progress.
- Supporting progress bars and legend.

Course preview cards:

- Category gradient top bar.
- Thumbnail or gradient fallback.
- Category badge.
- Status badge: Done or percent.
- Module dots/pills.
- Progress bar.
- Continue or Review Course CTA.

Certificate preview cards:

- Amber/yellow theme.
- Star icon.
- Earned badge.
- Issue date.
- Short certificate ID.

Recent activity timeline:

- Vertical timeline line.
- Icon tile per activity.
- Course or certificate event labels.
- Date rows.

Empty states:

- Centered Brain icon.
- Muted message.
- Primary "Explore Courses" or "Browse Courses" action.

### Student Courses Catalog

Purpose: Browse, search, filter, enroll, continue, or review courses.

Header:

- Title: Available Courses.
- Subtitle: Enroll in courses and start learning.

Controls:

- Search input with Search icon.
- Segmented filter tabs:
  - All Courses
  - In Progress
  - Completed
- Each tab includes icon and count.

Course card components:

- Category gradient top bar.
- Thumbnail image or gradient fallback.
- Bottom-left category badge.
- Top-right enrolled/completed status badge.
- Title.
- Short description.
- Progress bar if enrolled.
- Stats mini-grid:
  - Modules
  - Videos
  - Quizzes
  - Students
- Module pills like `M1: 3v 5q`.
- CTA:
  - Enroll Now
  - Continue Learning
  - Review Course

Empty states:

- No in-progress courses.
- No completed courses.
- No search results.
- No available courses.

### Course Learning Workspace

Purpose: Core student learning interface.

Layout:

- Wide workspace maxing up to very large screens.
- Header with back button, course title, module completion count, progress bar.
- Optional course completion banner.
- Two-column layout:
  - Left module/sidebar list.
  - Right learning content.

Course completion banner:

- Amber glass card.
- Trophy icon.
- Completion message.
- View Certificate CTA.

Module sidebar:

- Sticky left panel.
- Module cards with:
  - Number, check icon, or lock icon.
  - Title.
  - Video count.
  - Test availability text.
  - Score when passed.
  - Chevron expansion indicator.
  - Video progress bar.
- Expanded module contains video playlist:
  - Each video row has watched/current/index indicator.
  - Current video has purple active border.
  - Watched videos show green check.

Learning content:

- Module heading.
- Take Test / Retake Test button appears when videos complete and questions exist.
- Custom video player.
- AI tools button row.
- Expandable AI-generated panels.
- Locked test prompt if videos are incomplete.

AI tool buttons:

- AI Practice Quiz: purple.
- AI Study Notes: cyan.
- Find Resources: emerald.
- Mind Map: amber.

AI practice quiz panel:

- Question list.
- Multiple-choice option buttons.
- Selected state.
- Correct state: green.
- Wrong state: red.
- Explanation text.
- Check Answers button.
- Score after submit.
- Generate New link/button.

AI study notes panel:

- Notes text body.
- Download button.
- Close button.

Resources panel:

- Grid of resource cards.
- Resource type icon:
  - GitHub
  - Dataset
  - Notebook
  - Slides/presentation
  - PDF/article
  - Generic learning resource
- External link indicator.
- Title, description, type, source.

Mind map panel:

- React Flow canvas in a glass card.
- Header with title and close button.
- Central gradient node.
- Branch nodes positioned radially.
- Child and sub-child nodes.
- Dots background.
- Controls and minimap.

No selected module state:

- Centered glass card with PlayCircle icon and "Select a module to start learning".

### Video Player Component

Purpose: YouTube-based player with controlled learning flow.

Visual components:

- 16:9 video container inside glass card.
- Hidden default YouTube controls.
- Bottom overlay to discourage progress-bar seeking.
- Video title/info row.
- Watched or Watch fully status.

Checkpoint question overlay:

- Full video overlay with dark backdrop blur.
- Centered quiz card.
- Timestamp and "Checkpoint Question" header.
- Multiple-choice option buttons.
- Submit Answer button.
- Correct continue button.
- Wrong restart button.
- Explanation area.

UX:

- Video pauses at checkpoint timestamps.
- Correct answer allows continuing.
- Wrong answer restarts video from the beginning.
- Watched status appears after video completion.

### Module Test Page

Purpose: Formal assessment after module videos.

Test view:

- Header with back button, Module Test title, module title.
- Progress card:
  - Current question.
  - Answered count.
  - Progress bar.
- Question card:
  - Q badge.
  - Question text.
  - Four option buttons labeled A-D.
  - Selected option uses purple border/background.
- Navigation:
  - Previous button.
  - Question number dots.
  - Next or Submit button.
- Warning card when some questions remain unanswered.
- Large submit button once all questions answered.

Result view:

- Score card with Trophy or XCircle.
- Large percentage score.
- Passed / Not Passed text.
- Correct answer count.
- Passing score.
- Certificate earned badge.
- Actions:
  - Back to Course.
  - Continue to Next Module.
  - View Certificate.
  - Try Again.
- Answer review list:
  - Green/red icon per question.
  - Correct and selected answer text.
  - Explanation.

### Student Certificates Page

Purpose: View earned certificates and download verified certificates.

Hero:

- Amber/gold themed hall-of-fame card.
- Trophy icon.
- Count tile.

Empty state:

- Trophy circle.
- "No certificates yet".
- Completion guidance.

Certificate grid card:

- Gradient top bar based on course category.
- Banner with star badge.
- Status badge:
  - Verified.
  - Pending.
  - Revoked.
- Course title.
- Category pill.
- Issued date row.
- Certificate number row.
- Action strip:
  - View & Download.
  - Hide Certificate.
  - Awaiting Admin Verification.

Expanded certificate view:

- Full certificate component.
- Status message.
- PDF download button if verified.
- Disabled download message if pending/revoked.

### Certificate Card Component

Purpose: Render a formal certificate as a downloadable visual.

Visual style:

- Dark navy background.
- Gold ornamental borders.
- Corner ornament lines.
- Side ornament chains.
- Serif certificate typography.
- Academy title at top.
- Large "Certificate of Recognition".
- Presented-to section.
- Student name in large serif style.
- Course name in gold bordered capsule.
- Completion recognition text.
- Course completed badge.
- Issued date.
- Certificate ID.
- Verification URL.
- Digital verification footer.

Status footer:

- Verified: green status bar with external link.
- Pending: amber status bar.
- Revoked: red status bar with reason.

Download:

- Primary button: Download Certificate (PDF).
- Loading text: Generating PDF.

### Student Leaderboard Page

Purpose: Gamified monthly ranking.

Header:

- Trophy icon.
- Gradient Leaderboard title.
- Subtitle about points and monthly prizes.

Earn Points card:

- Login +5.
- Enroll +10.
- Pass Test +25.
- Certificate +100.

Leaderboard component:

- Monthly header with month navigation.
- Prize banner for current month.
- Top 3 podium.
- Remaining ranked list.
- My rank footer for students outside top 3.

### Leaderboard Component

Components:

- Month/year header.
- Previous/next month buttons.
- Days-left label for current month.
- Prize banner with Gift icon.
- Top 3 podium:
  - Rank 1 tallest.
  - Rank 2 medium.
  - Rank 3 shorter.
  - Medal/crown badges.
  - Avatar initials.
  - Points.
- Rest list:
  - Rank square.
  - Avatar.
  - Name.
  - "you" marker if current user.
  - Points with Zap icon.
- Empty state.
- Loading spinner.

### Student Profile Page

Purpose: Account identity, profile editing, and password change.

Hero:

- Gradient card with avatar initials.
- Online green dot.
- Name.
- Member since date.
- Student and Verified badges.
- Edit Profile / Cancel Editing button.
- Three stat cards:
  - Enrolled courses.
  - Certificates earned.
  - Achievements unlocked.

Personal information card:

- View mode:
  - Full name.
  - Phone.
  - Email.
  - Add email action if empty.
  - Edit Profile action.
- Edit mode:
  - Full name input.
  - Phone input with +91 prefix.
  - Email input.
  - Cancel and Save Changes buttons.

Change password card:

- Current password input with visibility toggle.
- New password input with visibility toggle.
- Password strength bar.
- Confirm password input with visibility toggle.
- Match/mismatch hints.
- Disabled Change Password button until valid.

Account status bar:

- Green verified message.

## 8. Admin Experience

### Admin Dashboard

Purpose: Operational overview for platform admins.

Sections:

- Welcome hero.
- Stat cards.
- Quick actions.
- Charts.
- Recent activity.
- Mini leaderboard.
- Recent students list.

Hero:

- Admin Dashboard badge.
- Welcome Admin headline.
- Summary counts on desktop.
- Purple/cyan glow background.

Stat cards:

- Total Courses.
- Modules.
- Students.
- Certificates.

Quick actions:

- Create Course.
- Manage Videos.
- View Students.
- Activity Log.

Charts:

- Bar chart: Students Enrolled per Course.
- Pie chart: Courses by Category.

Live activity mini-list:

- Avatar.
- Student name.
- Activity detail.
- Points earned.
- Time.

Mini leaderboard:

- Rank badge.
- Student link.
- Points.

Recent students:

- Avatar.
- Name.
- Phone.
- Join date.
- Chevron.

### Admin Courses Page

Purpose: Course catalog management.

Header:

- Courses title.
- New Course button.

Stats:

- Total Courses.
- Published.
- Total Videos.
- Enrollments.

Controls:

- Search input.
- Select All button.
- Bulk action bar appears when cards are selected.

Course management card:

- Checkbox overlay.
- Category gradient bar.
- Thumbnail/gradient image area.
- Category badge.
- Published/Draft badge.
- Title.
- Description.
- Stats mini-grid:
  - Modules.
  - Videos.
  - Questions.
  - Students.
- Module pills.
- Actions:
  - Publish/Unpublish.
  - Manage.
  - Delete icon.

Modals:

- Single delete confirmation.
- Bulk delete confirmation.

Bulk action bar:

- Selected count.
- Clear button.
- Delete selected button.

Empty states:

- No courses.
- No matching search results.

### New Course Page

Purpose: Create a course shell and module list.

Layout:

- Centered max-width form.
- Back button.
- Title and subtitle.
- Glass card with gradient border.

Form components:

- Course title input.
- Description textarea.
- Category input.
- Thumbnail upload picker:
  - Image preview tile.
  - Choose File action.
  - Remove thumbnail link.
- Module count stepper:
  - Minus button.
  - Large count display.
  - Plus button.
- Module name inputs, one per module.
- Course preview card with title and module badges.
- Primary create button.

UX:

- Thumbnail supports image preview.
- Module count ranges from 1 to 20.
- Module names update dynamically with count.

### Course Manage Page

Purpose: Manage modules, videos, questions, checkpoint questions, and test settings from a single screen.

Header:

- Back button.
- Course title.
- Published/Draft badge.
- Module count.

Module accordion:

- Module number tile.
- Title.
- Metadata row:
  - videos count.
  - questions count.
  - pass percentage.
  - questions shown per test.
- Completion indicators for videos/questions.
- Chevron expand/collapse.

Module tabs:

- Videos tab.
- Questions tab.

### Module Video Form

Purpose: Add and view saved videos for a module.

Saved videos list:

- Thumbnail.
- Title.
- URL.
- Order badge.

Add video form:

- Repeatable video cards.
- Video number.
- Remove button.
- Title input.
- YouTube URL input with Link icon.
- Valid URL detected hint.
- Add Another Video button.
- Save Videos button.

### Module Questions Panel

Purpose: Manage manual questions, bulk import, checkpoint questions, and test settings.

Tabs:

- Add Manually.
- Bulk CSV/Excel.
- Checkpoint Qs.
- Test Settings.

Manual question UI:

- Accordion question cards.
- Q badge.
- Question textarea.
- Four option inputs.
- Correct option radio-style selector.
- Explanation input.
- Remove question.
- Add Question.
- Save Questions.

Bulk import UI:

- CSV format guide.
- Code-style example.
- Large textarea for CSV.
- Import Questions button.

Checkpoint question UI:

- Guidance card.
- Checkpoint accordion cards.
- Video selector.
- Timestamp input in MM:SS.
- Question textarea.
- Four option inputs.
- Correct option selector.
- Explanation input.
- Add Checkpoint.
- Save Checkpoints.
- Empty prompt if no videos exist.

Test settings UI:

- Passing Score input.
- Questions per Test input.
- Save Settings button.

Saved questions list:

- Q or timestamp badge.
- Question text.
- Associated video line if checkpoint.
- Option pills with correct option highlighted green.
- Delete icon.

### Admin Students Page

Purpose: Search, filter, sort, and register users.

Header:

- Students title.
- Registered user count.
- Register User button.

Summary cards:

- Total Users.
- Enrolled.
- Certificates.
- Not Started.

Analytics cards:

- Scope.
- Enrolled.
- Completed.
- In Progress.

Controls:

- Search by name, phone, email.
- Filters toggle.
- Clear filters.
- Filter panel:
  - Course dropdown.
  - Certificate filter.
  - Enrollment filter.
  - Status filter.
- Sort controls in table headers.

Student table:

- Avatar + name.
- Contact phone/email.
- Courses summary.
- Progress bar.
- Certificate count badge.
- Joined date.
- Details link icon.

Register modal:

- Name input.
- Phone input.
- Email input.
- Password input.
- Role segmented control: Student/Admin.
- Register button.

### Admin Student Detail Page

Purpose: Inspect and edit one student.

Header:

- Back button.
- Student name.
- Phone and joined date.
- Edit Student button.

Edit form:

- Name input.
- Phone input.
- Email input.
- New password input.
- Save Changes button.

Stats:

- Courses enrolled.
- Modules completed.
- Certificates.

Certificates section:

- Award icon.
- Course title.
- Certificate number suffix.
- Issue date.

Enrollment details:

- Per-course card.
- Enrolled date.
- Module progress rows:
  - Module number.
  - Module title.
  - Video status.
  - Test pending / passed score / not started.

Test history:

- Pass/fail icon.
- Module title.
- Attempt date.
- Score.

### Admin Certificates Page

Purpose: Verify, revoke, restore, export, and filter certificates.

Header:

- Breadcrumb.
- Certificate Management title with ShieldCheck icon.
- Export CSV button.
- Refresh button.

Stats:

- Total Issued.
- Verified.
- Pending Review.
- Revoked.

Controls:

- Search.
- Status filter.
- Student filter.
- Course filter.
- Sort options.
- Select all.
- Bulk verify.
- Bulk revoke.

Certificate table:

- Select checkbox.
- Student avatar/name/phone.
- Course title/category.
- Certificate number with copy verification link.
- Issued date.
- Status badge.
- Actions:
  - Copy link.
  - Open verification page.
  - Verify.
  - Revoke.
  - Restore.

Status styles:

- Verified: emerald.
- Pending: amber.
- Revoked: red.

Modals:

- Revoke certificate modal with reason textarea.
- Bulk revoke modal with shared reason textarea.

Export:

- CSV export interaction available from frontend.

### Admin Activity Log Page

Purpose: Monitor learning and login events.

Header:

- Activity Log title with Activity icon.
- Subtitle.
- Refresh icon button.

Summary cards:

- Total Events.
- Active Today.
- Online in last 30 minutes.
- Certificates Issued.

Filters:

- Search by name, phone, or detail.
- Action filter pills:
  - All.
  - Login.
  - Logout.
  - Enrolled.
  - Video.
  - Test Passed.
  - Certificate.

Log list:

- Event icon tile.
- Student avatar link.
- Student name and phone.
- Event detail.
- Points pill if positive.
- Date and time.

Pagination:

- Showing range text.
- Previous/next icon buttons.

### Admin Leaderboard Page

Purpose: Admin view of gamified ranking.

Sections:

- Header with Trophy icon and gradient title.
- Points system guide:
  - Login.
  - Enroll Course.
  - Video Watched.
  - Test Passed.
  - Certificate.
- Shared leaderboard component without "my rank" footer.

## 9. Route/Screen Inventory

Public:

- `/` Landing page.
- `/login` Login page.
- `/register` Registration and OTP flow.
- `/verify/[code]` Certificate verification.
- Not found page.
- Error page.

Student:

- `/dashboard` Student dashboard.
- `/dashboard/courses` Course catalog.
- `/dashboard/courses/[courseId]` Course learning workspace.
- `/dashboard/courses/[courseId]/test/[moduleId]` Module test.
- `/dashboard/certificates` Student certificates.
- `/dashboard/leaderboard` Student leaderboard.
- `/dashboard/profile` Profile and password management.

Admin:

- `/admin` Admin dashboard.
- `/admin/courses` Course management.
- `/admin/courses/new` New course form.
- `/admin/courses/[id]` Course/module management.
- `/admin/students` Student management.
- `/admin/students/[id]` Student detail.
- `/admin/certificates` Certificate management.
- `/admin/activity` Activity log.
- `/admin/leaderboard` Leaderboard.

## 10. Component Inventory

Global:

- Providers
- Toast provider/theme
- Button styles
- Input styles
- Glass card styles
- Badges
- Gradient text
- Grid background
- Neon divider
- Loading spinner
- Empty-state card
- Modal shell
- Sidebar layout
- Mobile header

Public:

- Landing navbar
- Brand mark
- Hero badge
- Hero CTA buttons
- Stats cards
- Feature cards
- Learning path step card
- CTA card
- Auth logo block
- Login card
- Register step indicator
- OTP card
- Verification result card
- 404/500 pages

Student:

- Student sidebar
- Student user card
- Dashboard welcome hero
- Progress ring
- Continue learning banner
- Stat card
- Learning insight card
- Bar chart card
- Radial progress chart
- Course card
- Course module dot/pill row
- Certificate preview card
- Activity timeline
- Search/filter tab controls
- Course detail header
- Module accordion/sidebar item
- Video playlist item
- Video player
- Checkpoint question overlay
- AI tool button
- AI practice quiz panel
- AI notes panel
- Learning resources panel
- Mind map panel
- Test question card
- Question navigation dots
- Test result score card
- Answer review card
- Certificate grid card
- Full certificate renderer
- Leaderboard podium card
- Leaderboard list row
- Profile hero
- Profile info card
- Password change card

Admin:

- Admin sidebar
- Admin dashboard stat card
- Quick action card
- Enrollment bar chart
- Category pie chart
- Recent activity row
- Mini leaderboard row
- Recent student row
- Admin course card
- Bulk action bar
- Delete confirmation modal
- New course form
- Thumbnail upload field
- Module count stepper
- Course preview card
- Module accordion
- Module tab selector
- Saved video row
- Video add card
- Question tab selector
- Manual question accordion
- Bulk CSV import panel
- Checkpoint question accordion
- Test settings panel
- Saved question row
- Student table
- Filter panel
- Register user modal
- Student edit form
- Student module progress row
- Test attempt row
- Certificate stats card
- Certificate table row
- Certificate status badge
- Certificate revoke modal
- Activity filter pills
- Activity event row
- Pagination buttons
- Points guide card

## 11. UX Rules To Preserve In A Replica

- Make the first screen useful immediately. Do not replace the app with a marketing-only shell.
- Keep sidebars persistent on desktop and collapsible on mobile.
- Use icon-led navigation and actions.
- Show progress everywhere: course progress, module progress, test progress, certificate status.
- Use clear locked/unlocked states for sequential learning.
- Keep admin screens dense but readable.
- Use tables for large operational lists and cards for browsable course/certificate items.
- Use color consistently:
  - Purple: primary action/current item.
  - Cyan: learning tools and secondary progress.
  - Green: passed/completed/verified.
  - Amber: certificate/prize/pending/warning.
  - Red: failed/revoked/destructive.
- Use empty states with one clear next action.
- Use modals only for focused tasks: register user, delete, revoke.
- Use toasts for save, error, validation, and completion feedback.
- Use motion lightly to make state changes feel alive, not distracting.

## 12. Adaptation Guide For Another Platform

To reuse this frontend for a different purpose:

1. Replace brand name, logo icon, and domain words.
2. Keep the visual system if the new platform should feel premium/technical.
3. Replace course categories with the new domain categories.
4. Rename student/admin roles if needed.
5. Rename modules, tests, certificates, leaderboard points, and activity labels to match the new purpose.
6. Keep the screen structure:
   - Public landing.
   - Auth.
   - Learner dashboard.
   - Catalog.
   - Item detail workspace.
   - Assessment/results.
   - Achievements/certificates.
   - Profile.
   - Admin operations.
7. Keep reusable UI components independent from content so the platform can become a training portal, compliance portal, onboarding portal, coaching platform, or internal academy.

## 13. Suggested Frontend Folder Structure For Replication

Use a similar organization:

```text
src/
  app/
    page.tsx
    login/page.tsx
    register/page.tsx
    verify/[code]/page.tsx
    dashboard/
      layout.tsx
      page.tsx
      courses/page.tsx
      courses/[courseId]/page.tsx
      courses/[courseId]/test/[moduleId]/page.tsx
      certificates/page.tsx
      leaderboard/page.tsx
      profile/page.tsx
    admin/
      layout.tsx
      page.tsx
      courses/page.tsx
      courses/new/page.tsx
      courses/[id]/page.tsx
      students/page.tsx
      students/[id]/page.tsx
      certificates/page.tsx
      activity/page.tsx
      leaderboard/page.tsx
  components/
    Providers.tsx
    Leaderboard.tsx
    student/
      VideoPlayer.tsx
      MindMap.tsx
      CertificateCard.tsx
    admin/
      ModuleVideoForm.tsx
      ModuleQuestionsPanel.tsx
```

## 14. Minimum Frontend Design Tokens

For a clean replica, define these tokens:

```text
Background:
  dark: #050508
  dark-100: #0A0A12
  dark-200: #0D0D1A
  dark-300: #131325
  dark-400: #1A1A30

Accent:
  purple-400: #A78BFA
  purple-500: #8B5CF6
  purple-600: #7C3AED
  purple-700: #6D28D9
  cyan-400: #22D3EE
  cyan-500: #06B6D4
  cyan-600: #0891B2

Surfaces:
  glass: rgba(255,255,255,0.03)
  glass-hover: rgba(255,255,255,0.06)
  border-soft: rgba(255,255,255,0.06)
```

## 15. Key Replication Principle

The platform is not just a set of pages. Its core frontend pattern is:

```text
Dark premium shell
+ clear role-based navigation
+ card-based progress UI
+ guided learning workspace
+ test/result feedback loop
+ certificate/achievement layer
+ admin operational dashboard
```

Preserve that pattern, then change the subject matter.
