# 🚀 SmartLearn Deployment Guide

## Free Tier Deployment (Render + Vercel)

### Step 1: Set up MySQL Database (Free)

**Option A: PlanetScale (Recommended)**
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create a new database called `smartlearn`
4. Get your connection string from the dashboard

**Option B: Railway MySQL (Alternative)**
1. Go to [railway.app](https://railway.app)
2. Create account → New Project → Add MySQL
3. Copy the DATABASE_URL

### Step 2: Deploy Backend on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Blueprint"
   - Connect your GitHub repo: `prabhanshupawar-tech/SmartLearnNew`
   - Render will auto-detect the `render.yaml` file
   - Set service name: `smartlearn-backend`
   - Add environment variables:
     ```
     DATABASE_URL=your_mysql_connection_string
     DATABASE_USERNAME=your_db_username
     DATABASE_PASSWORD=your_db_password
     JWT_SECRET=your-super-secret-jwt-key-here
     ```
   - Click "Create Blueprint"
   - Wait for deployment (5-10 minutes)

3. **Get Backend URL**
   - After deployment, copy the service URL (e.g., `https://smartlearn-backend.onrender.com`)

### Step 3: Deploy Frontend on Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import from GitHub: `prabhanshupawar-tech/SmartLearnNew`
   - Configure:
     - **Root Directory**: `smartlearn-ui`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variable:
     ```
     VITE_API_BASE_URL=https://smartlearn-backend.onrender.com
     ```
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)

3. **Get Frontend URL**
   - Copy the deployment URL (e.g., `https://smartlearn-ui.vercel.app`)

### Step 4: Test Your Application

1. **Update CORS (if needed)**
   - In your backend code, ensure CORS allows your frontend domain
   - Add to `application.properties`:
     ```
     cors.allowed-origins=https://smartlearn-ui.vercel.app
     ```

2. **Test Features**
   - Admin registration/login
   - Test creation and question management
   - Student quiz taking with proctoring

### Step 5: Custom Domain (Optional)

**Vercel Custom Domain:**
- Go to your project settings
- Add custom domain
- Configure DNS records

**Render Custom Domain:**
- Go to service settings
- Add custom domain
- Configure DNS records

## 🔧 Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify database connection string
- Ensure JWT_SECRET is set

### Frontend Issues:
- Check browser console for API errors
- Verify VITE_API_BASE_URL is correct
- Check CORS settings

### Database Issues:
- Ensure database is accessible from Render
- Check connection limits on free tier
- Verify credentials are correct

## 💰 Cost Summary (Free Tier)

- **Render**: 750 hours/month free
- **Vercel**: Unlimited free
- **PlanetScale**: 1 database free
- **Total**: $0/month

## 🎯 Your Live URLs

After deployment:
- **Frontend**: `https://smartlearn-ui.vercel.app`
- **Backend API**: `https://smartlearn-backend.onrender.com`

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration