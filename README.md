# Dent-X

Site clinică stomatologică — bazat pe template-ul Dr. Panfil, rebranduit pentru **Dent-X**.

## Pornire locală

```powershell
cd "C:\Users\natas\OneDrive\Desktop\clinici dentale\dent-x"
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Ce să personalizezi

| Fișier / folder | Conținut |
|---|---|
| `lib/constants.ts` | Nume clinică, telefon, email, adresă |
| `app/globals.css` | Culoarea brand (`--color-brand-teal`) |
| `public/` | `hero.png`, `hero-mobile.png`, `under-hero.jpg`, `under1-hero.png`, poze before/after |
| `components/Reviews.tsx` | URL-uri Instagram reel embed |
| `components/*.tsx` | Texte suplimentare dacă e nevoie |

## Deploy (Vercel)

1. Creează repo nou pe GitHub (ex. `dent-x`)
2. `git init`, commit, push
3. Vercel → **New Project** → import repo `dent-x`
4. Deploy separat de Dr. Panfil

## Notă logo

Navbar-ul folosește text **Dent-X** până înlocuiești `public/logo.svg` și `public/white.svg` cu logo-ul tău.
