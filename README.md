# My Closet

A personal wardrobe ledger — track what you bought, when, and how much. Designed for personal use, syncs across devices via a private GitHub Gist.

## Live App

Once deployed: `https://<your-username>.github.io/<repo-name>/`

## Setup

### 1. Fork / clone this repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
```

### 2. Create a private GitHub Gist (for data storage)

Go to [gist.github.com](https://gist.github.com), create a new **secret** gist:

- **Filename**: `closet.json`
- **Content**: `[]`

Click "Create secret gist". From the URL `https://gist.github.com/<user>/<id>`, copy the `<id>` part — that's your **Gist ID**.

### 3. Generate a Personal Access Token

Go to [github.com/settings/tokens](https://github.com/settings/tokens?type=beta) → **Fine-grained tokens** → **Generate new token**.

- **Token name**: `my-closet-sync`
- **Expiration**: as you prefer (90 days minimum recommended)
- **Resource owner**: yourself
- **Repository access**: doesn't matter (we only need gist access)
- **Account permissions** → **Gists**: select **Read and write**

Generate and copy the token (starts with `github_pat_...`).

### 4. Deploy to GitHub Pages

Push the code to your `main` branch, then in your GitHub repo:

**Settings → Pages → Build and deployment → Source**: `Deploy from a branch` → `main` / `(root)` → Save

Wait ~1 minute and the site will be live.

### 5. Open the app and configure

Open the deployed URL. Click the ⚙ (settings) icon in the top right. Enter:

- The Personal Access Token from step 3
- The Gist ID from step 2

Click **Test Connection** to verify, then **Save**. Your data is now synced.

### 6. Add to iPhone home screen

Open the deployed URL in **Safari** on iPhone → tap the Share button → **Add to Home Screen**. The app will run full-screen like a native app.

Repeat the settings step (4) on each device — the token is stored locally on each device for security.

## Architecture

- **Hosting**: static HTML/JS/CSS on GitHub Pages
- **Data**: a single private GitHub Gist holds `closet.json`
- **Sync**: app reads on load + on focus, writes are debounced to the Gist via the GitHub API
- **Auth**: your Personal Access Token, stored only in your browser's localStorage
- **Offline**: data is cached in localStorage; service worker caches the app shell so the app loads without a network

## Files

```
index.html          — the entire app (HTML + CSS + JS)
manifest.json       — PWA manifest (Add to Home Screen)
sw.js               — service worker (offline support)
icons/              — PWA + iOS icons
```

## Privacy & Security

- The GitHub Pages URL only serves the app code — no data.
- Your token + Gist ID live in localStorage on each device. No third party can read them.
- The Gist itself is private (only you and anyone with the URL can see it; secret Gists are not searchable).
- If your token leaks, revoke it immediately at [github.com/settings/tokens](https://github.com/settings/tokens).
