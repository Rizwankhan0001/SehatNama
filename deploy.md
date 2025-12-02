# 🚀 Quick Deployment Steps

## Deploy in 5 Minutes!

### 1️⃣ Setup MongoDB (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster
3. Database Access → Add User (username + password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Copy connection string

### 2️⃣ Deploy Backend (1 minute)
1. Go to https://vercel.com/new
2. Import: `Rizwankhan0001/SehatNama`
3. Settings:
   - Root Directory: `backend`
   - Framework: Other
4. Environment Variables:
   ```
   MONGODB_URI=your_connection_string_here
   JWT_SECRET=mysecretkey12345678901234567890
   NODE_ENV=production
   ```
5. Deploy → Copy URL (e.g., `https://sehetnama-api.vercel.app`)

### 3️⃣ Deploy Frontend (1 minute)
1. Go to https://vercel.com/new
2. Import: `Rizwankhan0001/SehatNama` (again)
3. Settings:
   - Root Directory: `./`
   - Framework: Create React App
4. Environment Variables:
   ```
   REACT_APP_API_URL=https://sehetnama-api.vercel.app/api
   ```
   (Use your backend URL from step 2)
5. Deploy

### 4️⃣ Seed Database (1 minute)
```bash
cd backend
npm install
echo "MONGODB_URI=your_connection_string" > .env
npm run seed
```

### ✅ Done! Your website is live!

**Frontend**: Check Vercel dashboard for your URL
**Backend**: Check Vercel dashboard for your API URL

---

## Need Help?

Read full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
