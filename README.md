# Nook 🏠

**Nook** is a minimalist, privacy-first personal space for your thoughts and tasks. It combines a daily journal with a smart to-do list, all stored locally in your browser.

<!-- TODO: add a real screenshot of the app here before launch -->

## ✨ Features

- **📝 Daily Journaling**: Distraction-free writing space with mood tracking.
- **✅ Smart To-Do List**: Prioritized tasks (1-3) with drag-and-drop organization.
- **🗄️ Archive System**: Keep your workspace clean by archiving completed tasks.
- **🔒 Privacy First**: All data is stored in `localStorage`. Nothing leaves your device.
- **💾 Import/Export**: Full JSON backup and restore functionality.
- **🎨 Beautiful Design**: Calming colors, smooth animations, and a responsive layout.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy Nook is with Vercel.

1. Push this code to a GitHub repository (done!).
2. Go to [Vercel.com](https://vercel.com) and sign up/log in.
3. Click **"Add New..."** -> **"Project"**.
4. Select your `nookapp` repository and click **"Import"**.
5. Keep the default settings (Framework Preset: Other).
6. Click **"Deploy"**.

Your app will be live in seconds!

### Run Locally

You can run Nook locally using any static file server.

```bash
# Python 3
python3 -m http.server 8000

# OR using npx
npx serve
```

Then open `http://localhost:8000` in your browser.

## 📖 User Guide

Check out [WALKTHROUGH.md](./WALKTHROUGH.md) for a comprehensive guide on how to use all features.

## 🔒 Privacy

See [privacy.html](./privacy.html) for details on what's stored locally and what the optional AI reflection feature sends to Groq.

## 📄 License

Personal Use.
