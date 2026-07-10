# 🚀 Deployment Guide for Adaptive Learning Tutor

## 📋 Overview
This guide provides instructions for deploying the Adaptive Learning Tutor platform.

## 🔧 Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- GitHub account with repository access

## 🏗️ Local Development

### Frontend Development
```bash
cd adaptive-learning-tutor
npm install
npm run dev
# Access at: http://localhost:3000
```

### Backend API
```bash
cd adaptive-learning-tutor/backend
npm install
npm run server
# API available at: http://localhost:5000
```

### Full Development Stack
```bash
cd adaptive-learning-tutor
npm run dev:all
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 🌐 Production Deployment

### GitHub Auto-Deploy
This project is configured with GitHub auto-deploy:
- Repository: Ferry737/Adaptive-Learning-Tutor
- Auto-deploy monitor is running
- Changes are automatically deployed on push

### Manual Deployment
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📊 Environment Configuration

### Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Adaptive Learning Tutor
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### GitHub Integration
The project includes auto-deployment scripts:
- `/opt/data/auto-deploy-project.sh` - Deploy individual projects
- `/opt/data/auto-deploy-monitor.sh` - Monitor for new projects

## 🔍 Monitoring & Maintenance

### Health Checks
- Frontend: Check http://localhost:3000
- Backend API: Check http://localhost:5000/api/health
- Auto-deploy monitor: Check process status

### Log Files
- Frontend logs: Browser console
- Backend logs: Terminal output
- Auto-deploy logs: System logs

## 🚀 CI/CD (Future Enhancement)

The project is ready for:
- GitHub Actions workflows
- Docker containerization
- Kubernetes deployment
- Vercel/Netlify frontend deployment

## 📞 Support

For deployment issues:
1. Check logs in terminal
2. Verify environment variables
3. Test API endpoints
4. Check GitHub repository status

---

**Last Updated:** 2026-07-10
**Version:** 1.0.0
**Repository:** Ferry737/Adaptive-Learning-Tutor