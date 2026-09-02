# Deploy pgt-web → Vercel

## Env vars

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://perugrandtravel.vercel.app` (or `https://beta.perugrandtravel.com`) |
| `NEXT_PUBLIC_GTM_ID` | `GTM-K8SZBJM5` |
| `NEXT_PUBLIC_ENV` | `beta` (enables noindex + environment tag in dataLayer) |

## Steps

```bash
cd pgt-web
git add .
git commit -m "MVP: greenfield EN — home, packages, tour, blog + GTM + SEO"
# Create repo JairoProDev/pgt-web on GitHub, then:
git remote add origin git@github.com:JairoProDev/pgt-web.git
git push -u origin main
```

1. https://vercel.com/new → Import `pgt-web`
2. Add env vars above
3. Deploy
4. Add domain `beta.perugrandtravel.com` (see `pgt/08-investigacion/auditoria-greenfield-2026-08-31/MENSAJE-DNS-RICARDO.md`)

## Verify

```bash
npm run build
npm start &
npm run validate-parity
npx lighthouse http://localhost:3000/tour/the-classic-salkantay-trek-5d/ --only-categories=performance,seo --form-factor=mobile --quiet --output=json --output-path=./lighthouse-tour.json
```
