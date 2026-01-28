# Deployment Guide 🚀

This guide helps you deploy the CareerBoost application to the cloud.

## 1. Backend (Railway)
1.  Create a GitHub repository and push your code.
2.  Sign up at [Railway.app](https://railway.app/).
3.  Click "New Project" -> "Deploy from GitHub repo".
4.  Select `careerboost-backend`.
5.  Railway will automatically detect `package.json` and the `start` script.
6.  **Variables**: Add the following in Railway "Settings" -> "Variables":
    *   `PORT`: `8080` (Railway sets this, but good to know)
    *   `JWT_SECRET`: (Generate a random string)
    *   `FRONTEND_URL`: `https://your-frontend-url.vercel.app` (Update this after frontend deploy)

## 2. Frontend (Vercel)
1.  Sign up at [Vercel.com](https://vercel.com/).
2.  Click "Add New..." -> "Project".
3.  Import the same GitHub repository.
4.  **Root Directory**: Click "Edit" and select `careerboost-frontend`.
5.  **Build Command**: Leave empty (it's static).
6.  **Output Directory**: Leave default.
7.  Click "Deploy".

## 3. Connect Them
1.  Copy your Vercel URL (e.g., `https://careerboost.vercel.app`).
2.  Go back to Railway Backend -> Variables.
3.  Set `FRONTEND_URL` to your Vercel URL.
4.  Redeploy Backend.
5.  Update your local frontend `src/api/client.js` `BASE_URL` to point to your Railway Backend URL (e.g., `https://careerboost-production.up.railway.app`) if you want to commit it, OR just rely on local testing.
    *   *Note*: For a production build, you might want to change `client.js` to automatically detect the host, or use an environment variable (requires a build step like Vite/Webpack, which we aren't using for simplicity).
    *   **Quick Fix for Prod**: Edit `src/api/client.js` line 1:
        ```javascript
        const API_BASE_URL = 'https://your-backend-url.up.railway.app/api';
        ```
