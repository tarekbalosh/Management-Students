# 🚀 Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Student Management System** to a production environment.

## 1. Infrastructure Overview
- **Frontend**: [Vercel](https://vercel.com) (Next.js)
- **Backend**: [Railway](https://railway.app) (Node.js Express)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **File Storage**: [Cloudinary](https://cloudinary.com)
- **Email**: [SendGrid](https://sendgrid.com) or [Gmail SMTP](https://support.google.com/a/answer/176600)

---

## 2. MongoDB Atlas Setup
1. **Create Cluster**: Sign up for MongoDB Atlas and create a new **M0 (Free)** cluster.
2. **Network Access**: Add `0.0.0.0/0` to the IP Access List (Temporary) or specific Railway/Vercel outbound IPs.
3. **Database User**: Create a user with `Read and Write to any database` permissions.
4. **Connection String**: Copy the connection string (SRV) for Node.js 2.2.12 or later.
   - Format: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/student_mgmt?retryWrites=true&w=majority`

---

## 3. Cloudinary Setup (File Storage)
1. **Sign Up**: Create a free account at [Cloudinary](https://cloudinary.com).
2. **Credentials**: Go to the Dashboard and copy your **Cloud Name**, **API Key**, and **API Secret**.
3. **Folders**: The system will automatically create a folder structure: `student-management/students/<studentId>/`.

---

## 4. Backend Deployment (Railway)
1. **Connect GitHub**: Connect your repository to Railway.
2. **Variable Setup**: Add the following in the **Variables** tab:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: (Your Atlas string)
   - `JWT_SECRET`: (Generate a long random string)
   - `JWT_REFRESH_SECRET`: (Generate another random string)
   - `CLOUDINARY_CLOUD_NAME`: (From Cloudinary)
   - `CLOUDINARY_API_KEY`: (From Cloudinary)
   - `CLOUDINARY_API_SECRET`: (From Cloudinary)
   - `EMAIL_USER`: (SMTP Email)
   - `EMAIL_PASS`: (SMTP Password / App Password)
   - `CLIENT_URL`: `https://your-app.vercel.app`
3. **Auto-Deploy**: Railway will use the `railway.toml` and detect the `server.js` automatically.

---

## 5. Frontend Deployment (Vercel)
1. **Import Project**: Select the `frontend` folder from your repository.
2. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.railway.app/api`
3. **Framework Preset**: Ensure "Next.js" is selected.
4. **Deploy**: Vercel will build and assign a production URL.

---

## 6. Post-Deployment Checklist
### 🔒 Security
1. [ ] **JWT Secrets**: Ensure production secrets are different from local ones.
2. [ ] **CORS**: Verify `CLIENT_URL` matches the Vercel domain in the backend.
3. [ ] **Password Hashing**: Confirm login works with new production users.
4. [ ] **Rate Limiting**: Check if `express-rate-limit` is active.

### 📁 Data & Files
5. [ ] **DB Connection**: Verify data persists in MongoDB Atlas.
6. [ ] **Cloudinary Upload**: Test uploading a student document.
7. [ ] **PDF Generation**: Download an invoice and check layout.
8. [ ] **File Deletion**: Ensure deleting a document removes it from Cloudinary.

### 📧 Notifications
9. [ ] **Email Delivery**: Verify that student notifications are sent via SMTP.
10. [ ] **Deep Linking**: Ensure links in emails point to the correct production domain.

### ⚡ Performance & UX
11. [ ] **Lighthouse Score**: Run a performance audit.
12. [ ] **Error Logs**: Check Railway "Logs" for exceptions.
13. [ ] **Responsive Design**: Test the portal on mobile.
14. [ ] **Toast Alerts**: Confirm success/error messages appear.

### 🧪 API Integrity
15. [ ] **Health Check**: Visit `/api/health` to confirm backend is "UP".
16. [ ] **Unread Count**: Verify the notification bell updates.
17. [ ] **Search Latency**: Test student search with Atlas indexes.
20. [ ] **Error Boundary**: Trigger an error to see the fallback UI.
