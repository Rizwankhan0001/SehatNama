# SehatNama Deployment Guide

## Option 1: Vercel (Recommended for Quick Deploy)

### Frontend Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### Backend Deployment
1. Go to backend: `cd backend`
2. Deploy: `vercel --prod`
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET`
   - `NODE_ENV=production`

### MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Get connection string
4. Add to Vercel environment variables

## Option 2: Render

### Backend Deployment
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables: Add `MONGODB_URI`, `JWT_SECRET`

### Frontend Deployment
1. Create new Static Site
2. Settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

## Option 3: Docker

### Local Testing
```bash
docker-compose up --build
```

### Production Deploy
```bash
# Build image
docker build -t sehetnama .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_secret \
  sehetnama
```

## Option 4: AWS EC2

### Setup
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Clone and setup
git clone https://github.com/Rizwankhan0001/SehatNama.git
cd SehatNama
npm install
cd backend && npm install

# Setup environment
cp backend/.env.example backend/.env
nano backend/.env  # Edit with your values

# Build frontend
npm run build

# Install PM2
sudo npm install -g pm2

# Start backend
cd backend
pm2 start src/server.js --name sehetnama-api
pm2 startup
pm2 save

# Setup Nginx
sudo apt-get install -y nginx
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/ubuntu/SehatNama/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables Required

- `PORT`: Backend port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: production/development

## Post-Deployment Checklist

- [ ] Update API endpoint in frontend (if separate deployment)
- [ ] Run database seed: `npm run seed`
- [ ] Test all API endpoints
- [ ] Configure CORS for production domain
- [ ] Setup SSL certificate (Let's Encrypt)
- [ ] Configure domain DNS
- [ ] Setup monitoring (optional)
- [ ] Enable error logging

## Quick Deploy Commands

```bash
# Build frontend
npm run build

# Test production build locally
npx serve -s build

# Deploy with Docker
docker-compose up -d

# Check logs
docker-compose logs -f
```
