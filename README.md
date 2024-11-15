### 這是一個可以自己增加事件且有農曆的行事曆

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deployment to GitHub Pages

### Prerequisites
- A GitHub account
- Git installed on your local machine
- Node.js and npm installed

### Setup Steps

1. **Install deployment dependency**
```bash
npm install gh-pages --save-dev
```

2. **Create Next.js configuration**

Create `next.config.js` in the project root:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/my-calendar-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my-calendar-app/' : '',
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
}

module.exports = nextConfig
```

3. **Update package.json**

Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "predeploy": "npm run build && touch out/.nojekyll",
    "deploy": "gh-pages -d out --dotfiles"
  }
}
```

4. **Create environment file**

Create `.env.production` in the project root:
```plaintext
NEXT_PUBLIC_BASE_PATH=/my-calendar-app
```

5. **Add .nojekyll file**
```bash
touch public/.nojekyll
```

### Deployment

1. **Initial setup (first time only)**
```bash
# Initialize Git if not already done
git init

# Add remote repository
git remote add origin https://github.com/[your-username]/my-calendar-app.git

# Create and switch to main branch if not already on it
git checkout -b main
```

2. **Deploy**
```bash
# Commit any changes
git add .
git commit -m "your commit message"
git push origin main

# Deploy to GitHub Pages
npm run deploy
```

3. **GitHub Repository Settings**

After deploying, configure GitHub Pages:
- Go to your repository on GitHub
- Navigate to Settings > Pages
- Set Source to "Deploy from a branch"
- Select branch "gh-pages" and folder "/(root)"
- Click Save

Your site will be available at: `https://[your-username].github.io/my-calendar-app/`

### Troubleshooting

If you encounter style issues:
- Make sure all styles are properly imported in `app/layout.js`
- Verify that `.nojekyll` file exists in both `public/` and `out/` directories
- Check if the deployment completed successfully in GitHub Actions
- Clear browser cache and perform a hard reload

### Subsequent Deployments

For future updates, simply:
```bash
npm run deploy
```

### Notes
- The deployment process may take a few minutes
- Changes may not be immediately visible due to caching
- Use `npm run build` to test the build locally before deploying

### Alternative Deployment

This app can also be deployed on Vercel, which offers a simpler deployment process:
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Follow the deployment steps
4. Your app will be live at `https://my-calendar-app.vercel.app` (or your custom domain)