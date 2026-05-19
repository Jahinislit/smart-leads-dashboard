# Smart Leads API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require `Authorization: Bearer <token>`.

## Auth

### Register

`POST /auth/register`

Body:

```json
{
  "name": "Jahin",
  "email": "jahin@example.com",
  "password": "password123",
  "role": "sales"
}
```

Roles are `admin` and `sales`.

### Login

`POST /auth/login`

```json
{
  "email": "jahin@example.com",
  "password": "password123"
}
```

### Current User

`GET /auth/me`

## Leads

### List Leads

`GET /leads?page=1&status=Qualified&source=Instagram&search=Rahul&sort=latest`

Supported query params:

- `page`: positive integer, backend limit is fixed at 10
- `status`: `New`, `Contacted`, `Qualified`, `Lost`
- `source`: `Website`, `Instagram`, `Referral`
- `search`: matches name or email
- `sort`: `latest` or `oldest`

Response includes pagination metadata:

```json
{
  "success": true,
  "message": "Leads fetched",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Website"
}
```

### Get Lead

`GET /leads/:id`

Used by the dashboard details modal to show a single lead record.

### Update Lead

`PATCH /leads/:id`

### Delete Lead

`DELETE /leads/:id`

Only `admin` users can delete leads.

### Export CSV

`GET /leads/export?status=Qualified&source=Instagram&search=Rahul&sort=latest`

Exports all leads matching the active filters as `leads.csv`.
