# Easy Progress Product Architecture

## Product Positioning

Easy Progress should feel closer to Linear/Todoist than a school checklist:

- Today-first focus
- Clear progress
- Fast checklist interactions
- Private by default
- Sharing when intentional

## Primary Views

1. Today
   - Today's tasks across all folders
   - Continue button
   - Urgent tasks surfaced first

2. Plan
   - Folder list
   - Notes inside selected folder
   - Checklist is central

3. Share
   - Copy link
   - Visibility: private, view-only link, editable link
   - Invite collaborators by email

4. Account
   - Email or Google login
   - Workspace switcher later

## Component Breakdown

- `DashboardShell`
- `Sidebar`
- `TodayPanel`
- `ProgressSummary`
- `TaskList`
- `NotePanel`
- `SharePanel`
- `InviteDialog`
- `VisibilityMenu`

## State Model

Client state:

- selected folder
- optimistic task updates
- open dialogs

Server state:

- users
- workspaces
- members
- plans
- folders
- notes
- tasks
- invites

## Sharing Flow

1. Owner clicks Share.
2. Owner selects:
   - private
   - view-only link
   - editable link
3. App updates `plans.visibility`.
4. App displays `/plan/<share_token>`.
5. Visitor can:
   - view if `link_view`
   - edit if `link_edit`
   - duplicate into their workspace after login

## Performance Rules

- Keep blur minimal.
- Render Today tasks first.
- Use optimistic updates for toggling tasks.
- Paginate or virtualize later if task count exceeds 500.
- Avoid global re-render when typing in notes.

## Deployment Sources

- Vercel supports Git-based deployments and creates deployments when code is pushed to connected repositories.
- Supabase Auth works with Next.js App Router and Supabase RLS secures browser-accessible data.
