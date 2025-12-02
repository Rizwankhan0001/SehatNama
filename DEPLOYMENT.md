# 🚀 SehatNama Deployment Guide

## Complete Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (for database)

---

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs: `0.0.0.0/0` (for Vercel)
5. Get your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/prescure_health
   ```

---

## Step 2: Deploy Backend API

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/new)
2. Import your GitHub repository: `Rizwankhan0001/SehatNama`
3. Configure:
   - **Project Name**: `sehetnama-api`
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
4. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   NODE_ENV=production
   PORT=5000
   ```
5. Click **Deploy**
6. Copy your backend URL (e.g., `https://sehetnama-api.vercel.app`)

### Option B: Via Vercel CLI

```bash
cd backend
vercel --prod
# Follow prompts and add environment variables
```

---

## Step 3: Deploy Frontend

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/new)
2. Import your GitHub repository again: `Rizwankhan0001/SehatNama`
3. Configure:
   - **Project Name**: `sehetnama`
   - **Root Directory**: `./` (root)
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://sehetnama-api.vercel.app/api
   ```
5. Click **Deploy**

### Option B: Via Vercel CLI

```bash
# From root directory
vercel --prod
# Follow prompts and add environment variables
```

---

## Step 4: Seed Database (One-time)

After backend is deployed, seed your database:

```bash
# Install dependencies locally
cd backend
npm install

# Create .env file with production MongoDB URI
echo "MONGODB_URI=your_mongodb_connection_string" > .env

# Run seed script
npm run seed
```

---

## Step 5: Update API URL in Frontend

1. Go to Vercel Dashboard → Your Frontend Project
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` with your actual backend URL
4. Redeploy: Deployments → Click "..." → Redeploy

---

## 🎉 Your Website is Live!

- **Frontend**: `https://sehetnama.vercel.app`
- **Backend API**: `https://sehetnama-api.vercel.app`

---

## Auto-Deployment

✅ Every push to `main` branch will automatically deploy to Vercel!

---

## Troubleshooting

### Backend Issues:
- Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Issues:
- Check if `REACT_APP_API_URL` is correct
- Verify CORS is enabled in backend
- Check browser console for errors

### Database Connection:
- Whitelist `0.0.0.0/0` in MongoDB Atlas
- Verify connection string format
- Check database user permissions

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Environment Variables Reference

### Backend (.env):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prescure_health
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
NODE_ENV=production
PORT=5000
```

### Frontend:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

---

## Quick Deploy Commands

```bash
# Deploy backend
cd backend && vercel --prod

# Deploy frontend
cd .. && vercel --prod
```

---

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- GitHub Issues: https://github.com/Rizwankhan0001/SehatNama/issues
