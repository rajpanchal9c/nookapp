# AI Task Suggestions - Setup Guide

This guide will help you set up the AI-powered task suggestion feature using Google's Gemini API.

## Prerequisites

- A Google account
- Access to your Vercel dashboard

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Select **"Create API key in new project"** (or use an existing project)
4. Copy the API key (it will look like: `AIzaSy...`)

⚠️ **Important:** Keep this key secret! Never commit it to GitHub.

## Step 2: Add API Key to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **nookapp** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Paste your API key from Step 1
   - **Environment:** Select all (Production, Preview, Development)
5. Click **Save**

## Step 3: Redeploy

After adding the environment variable, you need to trigger a new deployment:

1. Go to the **Deployments** tab in Vercel
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**

OR just push a new commit to GitHub (which you'll do anyway with these changes).

## Step 4: Test It

1. Go to your live site: `https://nookapp.vercel.app`
2. Write a journal entry like:
   ```
   I need to finish the presentation for Monday's meeting. 
   Also, I should email Sarah about the project update and 
   schedule a call with the design team.
   ```
3. Click **"✨ Suggest Tasks"**
4. The AI should extract tasks like:
   - Finish presentation for Monday
   - Email Sarah about project update
   - Schedule call with design team

## How It Works

- **Free Tier Limits:** 15 requests/minute, 1,500 requests/day
- **Cost:** Free for your current usage
- **Model:** Gemini 1.5 Flash (fast and efficient)
- **Privacy:** Journal content is sent to Google's API for processing

## Troubleshooting

### "AI service not configured" error
- Make sure you added the `GEMINI_API_KEY` environment variable in Vercel
- Redeploy after adding the variable

### "Failed to generate suggestions" error
- Check that your API key is valid
- Make sure you haven't exceeded the free tier limits (15 req/min)
- Check Vercel function logs for detailed errors

### No tasks extracted
- Try writing more specific, actionable content
- Include phrases like "I need to", "I should", "I have to"

## Usage Tips

**Good journal entries for task extraction:**
- "I need to finish the report by Friday"
- "Should call mom this weekend"
- "Have to review the pull requests tomorrow"

**Less effective:**
- "Feeling stressed about work" (too vague)
- "Had a good day" (no actions)

## Future Enhancements

Once you validate this feature, you can add:
- Weekly reflection summaries
- Journal prompt generator
- Mood-based task prioritization
- Smart title generation for entries

## Support

If you run into issues, check:
1. Vercel deployment logs
2. Browser console for errors
3. Google AI Studio quota page

---

**Ready to launch!** 🚀
