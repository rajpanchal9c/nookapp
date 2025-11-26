# How to Set Up Self-Hosted Umami Analytics

We are using **Supabase** for the database and **Vercel** to host the Umami analytics engine. This keeps your data 100% private and owned by you.

## Phase 1: Create the Database (Supabase)

1. Go to [Supabase.com](https://supabase.com/) and sign up/log in.
2. Click **"New Project"**.
3. **Name**: `nook-analytics` (or similar).
4. **Database Password**: **IMPORTANT:** Generate a strong password and **copy it somewhere safe**. You will need it in the next step.
5. **Region**: Choose a region close to your users (e.g., US East).
6. Click **"Create new project"**.
7. Wait a minute for the database to provision.
8. Once ready, go to **Project Settings** (gear icon) -> **Database**.
9. Under **Connection String**, make sure **"Node.js"** is selected.
10. Copy the **URI**. It looks like this:
    `postgres://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
11. **Replace `[YOUR-PASSWORD]`** in that string with the password you saved in step 4. This is your `DATABASE_URL`.

## Phase 2: Deploy Umami to Vercel

1. Go to the [Umami GitHub Repository](https://github.com/umami-software/umami).
2. Scroll down to the "Getting Started" section.
3. Click the **"Deploy to Vercel"** button.
4. This will clone Umami to your GitHub account and start a Vercel deployment.
5. In the Vercel setup screen, you will be asked for Environment Variables:
   - **`DATABASE_URL`**: Paste the Supabase connection string from Phase 1.
   - **`HASH_SALT`**: Type any random long string (e.g., `my-secret-nook-analytics-salt-7382`).
6. Click **"Deploy"**.
7. Wait for the build to finish. You will get a URL like `https://umami-nook.vercel.app`.

## Phase 3: Configure Umami

1. Visit your new Umami URL (e.g., `https://umami-nook.vercel.app`).
2. Log in with the default credentials:
   - **Username**: `admin`
   - **Password**: `umami`
3. **Immediately change your password** in the settings.
4. Go to **Websites** -> **"Add Website"**.
5. **Name**: `Nook`.
6. **Domain**: `nookapp.vercel.app` (or your custom domain).
7. Click **Save**.
8. Click the **Edit** button (pencil icon) next to your new website.
9. Go to the **Tracking Code** tab.
10. You will see two important pieces of info:
    - The **Script URL** (e.g., `https://umami-nook.vercel.app/script.js`)
    - The **Website ID** (e.g., `b34d9-....-....`)

## Phase 4: Connect to Nook

1. Open `index.html` in your Nook codebase.
2. Find the `<!-- Analytics -->` comment in the `<head>`.
3. Update the `src` and `data-website-id` with the values from Phase 3.
4. Push your code to GitHub.

```html
<!-- Example -->
<script defer src="https://umami-nook.vercel.app/script.js" data-website-id="YOUR-WEBSITE-ID"></script>
```

🎉 **Done!** You now have privacy-focused analytics tracking page views and visitors without tracking personal data.
