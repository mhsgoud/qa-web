# Ship to production (easiest path: Vercel)

This is a standard Next.js app. **Vercel** is the fastest way to deploy it — zero server config.

## 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for production"
git push origin main
```

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. **Add New Project** → import `qa-web`
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variable:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app` (or your custom domain)
5. Click **Deploy**

Build takes ~2 minutes. Every `git push` redeploys automatically.

## 3. Custom domain (optional)

Vercel project → **Settings → Domains** → add your domain and follow DNS instructions.

Update `NEXT_PUBLIC_SITE_URL` to match, then redeploy.

## 4. Before you go live

- [ ] Set answer `status` to `"published"` for pages you want indexed and pre-built
- [ ] `"draft"` and `"reviewed"` pages work on the site but are **noindex** and built on first visit only
- [ ] Run `npm run build` locally to catch errors
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real URL (sitemap + Open Graph)

## Alternatives

| Platform | Effort | Notes |
|----------|--------|-------|
| **Vercel** | Easiest | Built for Next.js, free tier |
| Netlify | Easy | Similar to Vercel |
| Cloudflare Pages | Medium | Good if you use Cloudflare DNS |
| VPS + Docker | Hard | Only if you need full control |

## Local production test

```bash
npm run build
npm run start
```

Open http://localhost:3000

## Costs (typical launch)

- **Vercel Hobby**: $0 for personal/small projects
- **Domain**: ~$10–15/year (optional)
- **OpenAI** (content generation only): pay per use, not needed at runtime

Your site is static-friendly — no database or API keys required in production unless you add server features later.
