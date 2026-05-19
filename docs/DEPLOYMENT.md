# Deployment Guide

Recommended deployment:

- Database: MongoDB Atlas
- Backend API: Render Docker Web Service
- Frontend: Vercel Vite app

## 1. Push Code To GitHub

```powershell
git add .
git reset client/.env server/.env .env "Full Stack Intern Assigment.pdf"
git commit -m "feat: build smart leads dashboard assignment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-leads-dashboard.git
git push -u origin main
```

## 2. Create MongoDB Atlas Database

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Allow network access for your deployment provider.
   - For Render free/simple deployment, use `0.0.0.0/0`.
4. Copy the connection string.

Example:

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/smart-leads
```

Replace `USERNAME`, `PASSWORD`, and the database name as needed.

## 3. Deploy Backend On Render

1. Go to Render and create a new Web Service.
2. Connect your GitHub repository.
3. Choose Docker deployment.
4. Set root directory to:

```text
server
```

5. Add environment variables:

```text
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<64-byte random secret>
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=<your Vercel frontend URL after frontend deploy>
```

Generate `JWT_SECRET` locally:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Deploy.
7. Confirm backend health:

```text
https://YOUR_RENDER_SERVICE.onrender.com/api/health
```

## 4. Deploy Frontend On Vercel

1. Import the same GitHub repository into Vercel.
2. Set root directory to:

```text
client
```

3. Use these settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

4. Add environment variable:

```text
VITE_API_URL=https://YOUR_RENDER_SERVICE.onrender.com/api
```

5. Deploy.

## 5. Update Backend CORS

After Vercel gives you the final frontend URL, go back to Render and update:

```text
CLIENT_URL=https://YOUR_VERCEL_APP.vercel.app
```

Redeploy/restart the Render service.

## 6. Seed Demo Data

Option A: Render shell:

```bash
node dist/seed.js
```

Option B: Seed from your local machine against Atlas:

```powershell
cd C:\Users\Jahin\Documents\Full_Stack_Task
Copy-Item server\.env.example server\.env
```

Put your Atlas `MONGO_URI` and same `JWT_SECRET` in `server/.env`, then run:

```powershell
npm run seed --workspace server
```

Demo credentials:

```text
Admin: admin@smartleads.dev / Password123!
Sales: sales@smartleads.dev / Password123!
```

## 7. Final Deployment Checks

- Open frontend URL.
- Login as admin.
- Confirm leads load.
- Open lead details.
- Test filters/search/sort together.
- Export CSV.
- Login as sales and confirm delete is unavailable.

## Official References

- Render Node/Express deployment: https://render.com/docs/deploy-node-express-app
- Render environment variables: https://render.com/docs/environment-variables
- Vercel Vite deployment: https://vercel.com/docs/frameworks/frontend/vite
- Vercel environment variables: https://vercel.com/docs/environment-variables
- MongoDB Atlas cluster setup: https://www.mongodb.com/quickstart/free-atlas-cluster
- MongoDB Atlas connection docs: https://www.mongodb.com/docs/atlas/connect-to-cluster/
