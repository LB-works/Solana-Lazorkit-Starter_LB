# Deploying Your Lazorkit Starter 🚀

To win the bounty, you need a **Live Demo**. This means your local app needs to be on the web.
Since this is a standard Next.js app, deployment is free and instant with **Vercel**.

## Option 1: Vercel (Recommended)

1.  **Push to GitHub**
    *   Create a new repo on GitHub.
    *   Push this code to it:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        # git remote add origin <your-repo-url>
        # git push -u origin main
        ```

2.  **Import to Vercel**
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Select your GitHub repo.
    *   **Settings**:
        *   Framework Preset: `Next.js` (Default)
        *   Root Directory: `.` (Default)
        *   Build Command: `npm run build` (Default)
    *   Click **Deploy**.

## Option 2: Netlify

1.  Drag and drop your project folder to Netlify Drop (if you run `npm run build` and `npm run export` locally first), OR
2.  Connect your GitHub repo to Netlify similar to Vercel.

## Verification for Bounty Judges

Once deployed, you will get a URL like `https://solana-lazorkit-starter.vercel.app`.
*   **Test on Devnet**: Open that URL.
*   **Connect**: Use your Passkey.
*   **Transact**: Try the "Gasless Transfer".

**That URL is your "Live Demo".**
