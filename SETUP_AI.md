# AI "Reflect with Nook" - Setup Guide

This guide will help you set up the AI-powered reflection feature using Groq's API.

## Prerequisites

- A Groq account
- Access to your Vercel dashboard

## Step 1: Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/keys)
2. Click **"Create API Key"**
3. Copy the API key (it will look like: `gsk_...`)

⚠️ **Important:** Keep this key secret! Never commit it to GitHub.

## Step 2: Add API Key to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **nookapp** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `GROQ_API_KEY`
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
3. Click **"✨ Reflect with Nook"**
4. You should see a short, empathetic reflection on the entry, plus extracted tasks like:
   - Finish presentation for Monday
   - Email Sarah about project update
   - Schedule call with design team

## How It Works

- **Model:** `llama-3.1-8b-instant` via Groq's OpenAI-compatible API
- **Endpoint:** `/api/insights` (Vercel serverless function)
- **Cost:** Fractions of a cent per call at Groq's current pricing
- **Rate limiting:** The endpoint caps requests per IP address (20/hour) to control abuse and cost
- **Privacy:** Journal content is sent to Groq's API for processing, and is not stored by Nook

## Troubleshooting

### "AI service not configured" error
- Make sure you added the `GROQ_API_KEY` environment variable in Vercel
- Redeploy after adding the variable

### "AI service error" / "Failed to generate insights"
- Check that your API key is valid
- Check Vercel function logs for detailed errors from the Groq API

### "Too many requests" error
- The endpoint is rate-limited to 20 requests/hour per IP. Wait and try again.

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

## Support

If you run into issues, check:
1. Vercel deployment logs
2. Browser console for errors
3. [Groq Console](https://console.groq.com) for API status/usage

---

**Ready to launch!** 🚀
