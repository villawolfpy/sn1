# SN Reader - Farcaster Mini App

A Farcaster Mini App for reading Stacker News posts and territories without leaving the client.

## Features

- Read homepage posts or specific territories (e.g., ~bitcoin, ~tech)
- Click posts for details within the modal
- Open posts in Stacker News for comments

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

Deploy to Vercel. The app is configured for Edge runtime on API routes.

### Required Assets

Add the following images to `public/`:
- `icon.png` (recommended 192x192)
- `splash.png` (recommended 424x695 for modal)

## Manifest

The mini app manifest is at `/.well-known/farcaster.json`.

## API

- `GET /api/rss?territory=<name>&page=<n>` - Fetch RSS feed

## Internationalization

Strings are in `lib/i18n.ts`. Currently supports English and Spanish.