# 2-Minute Demo Recording Script

Goal: show the hiring workflow clearly in about 2 minutes.

## Before Recording

Prepare:

- Deployed frontend URL open in browser.
- Demo data seeded.
- Admin credentials ready:

```text
admin@smartleads.dev
Password123!
```

- Sales credentials ready:

```text
sales@smartleads.dev
Password123!
```

Use OBS Studio, Loom, or Windows Snipping Tool screen recording.

## Recording Flow

### 0:00-0:15 - Intro

Say:

```text
This is Smart Leads Dashboard, a MERN TypeScript lead management app with JWT auth, RBAC, CRUD, filtering, pagination, CSV export, Docker, and dark mode.
```

Show the login page.

### 0:15-0:35 - Admin Login

Login as:

```text
admin@smartleads.dev / Password123!
```

Show dashboard loads with seeded leads.

Mention:

```text
This is a protected dashboard. The API uses JWT auth and backend middleware.
```

### 0:35-1:05 - Lead Workflow

Create a lead:

- Name: `Demo Hiring Lead`
- Email: `demo.hiring@example.com`
- Status: `New`
- Source: `Website`

Then edit it to:

- Status: `Qualified`
- Source: `Instagram`

Open the lead details modal with `View`.

Mention:

```text
The app supports create, update, list, and single lead details.
```

### 1:05-1:30 - Search, Filters, Pagination

Show combined filters:

- Status: `Qualified`
- Source: `Instagram`
- Search: `Rahul` or `Demo`
- Sort: `Latest` / `Oldest`

Mention:

```text
Filters work together and pagination is handled on the backend with a fixed limit of 10 records per page.
```

### 1:30-1:45 - CSV Export And Dark Mode

Click CSV export.

Toggle dark mode.

Mention:

```text
CSV export respects active filters, and the dashboard includes responsive dark mode support.
```

### 1:45-2:00 - RBAC

Logout and login as sales:

```text
sales@smartleads.dev / Password123!
```

Show delete action is not available.

Mention:

```text
Admin can delete leads. Sales users can view, create, update, and export, but cannot delete.
```

End with:

```text
The repository includes setup instructions, environment examples, Docker configuration, API docs, seed data, and backend API tests.
```

## Export Settings

- Length: under 2 minutes 15 seconds
- Resolution: 1080p if possible
- Format: MP4
- Filename:

```text
smart-leads-dashboard-demo.mp4
```
