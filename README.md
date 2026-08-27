# 💌 A Birthday Surprise, for him

A mobile-friendly Next.js site built around one flow:

**Home** → looks like a phone notification ("You've got a new message"). Tapping it
opens the surprise.

**`/surprise`** → a photo timeline, a love letter, a playlist, and an interactive
birthday cake he can blow the candles out on (tap, or actually blow into the mic).
At the bottom there's a "copy link" button for a **photobooth page** his friends
can use.

**`/photobooth`** → friends pick a layout from a Grid menu (2×6 strip of 3 or
4 photos, or a single 4×6 portrait/landscape), set a countdown timer, then hit
"Start Capture" — it takes all the photos automatically, and tapping any
photo afterward retakes just that one. There's also live Filters and Glow
controls while shooting. Next, they choose a frame: a plain color (which
unlocks dragging stickers onto the strip) or one of several fully-designed
templates for the 2×6 strips. Finally they write Viktor a birthday message
and send it straight to his wall (or just download a copy). All of this
happens on one page — no navigating between separate routes for each step.

**`/wall`** → Viktor's page. Every photo + message friends sent shows up here,
scattered like a corkboard, with a play/pause button for background music
while he reads through them. There's a link to it from `/surprise`.

---

## 1. Personalize it

Open **`lib/content.js`** — that's the main file you need to touch to make
this yours. It has his name, your name, the birthday date, the timeline
captions, the letter text, the playlist, and the wall page title.

- **Photos:** drop your real photos into `public/photos/` (any name), then
  update the `image` path for each timeline entry in `lib/content.js`.
- **Playlist:** either fill in the `songs` array (title/artist/optional Spotify
  link), or — easier — paste a Spotify playlist embed URL into
  `spotifyEmbedUrl` and it'll show a real embedded player instead. To get that
  URL: open your playlist on open.spotify.com → Share → Embed playlist → copy
  the `src` from the embed code.
- **Cake candles:** `cake.candleCount` in `lib/content.js` (caps at 12 rendered
  candles so it stays tidy on small screens, but the number itself is up to you).

## 2. Set up the memory wall (Firebase)

The `/wall` page needs somewhere to collect photos + messages from everyone
who uses `/photobooth` — that's what Firebase Firestore is for here. It's
free for something this size, and needs no server of your own.

1. Go to [console.firebase.google.com](https://console.firebase.google.com) →
   **Add project** (name it anything, e.g. "viktor-birthday"). You can skip
   Google Analytics when prompted.
2. In your new project, go to **Build → Firestore Database → Create database**.
   Choose a region close to you, and start in **test mode** (you'll lock it
   down with the rules below in step 4).
3. Go to **Project settings** (gear icon) → scroll to **Your apps** → click
   the **</>** (web) icon to register a web app. Give it any nickname, skip
   Firebase Hosting. You'll see a `firebaseConfig` object — copy those values
   into a new `.env.local` file in this project (use `.env.local.example` as
   the template).
4. Back in Firestore → **Rules** tab, replace the default rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /wishes/{wishId} {
         allow read: if true;
         allow create: if request.resource.data.name is string
                       && request.resource.data.message is string
                       && request.resource.data.name.size() <= 60
                       && request.resource.data.message.size() <= 500;
         allow update: if false;
         allow delete: if true;
       }
     }
   }
   ```
   This lets anyone read the wall and submit a wish, but not edit existing
   ones. Deletes are left open so the `/admin` page (see step 3) can remove
   things — note that this means delete access isn't actually enforced by
   these rules, only by the password screen in the app itself. That's fine
   for a private birthday project, but know that it's a soft lock, not a
   real one (see step 3 for more on that).
5. Restart `npm run dev` after adding `.env.local` (env vars only load on
   start). When you deploy (see step 6), add the same variables in your
   hosting provider's environment variable settings.

Until this is set up, `/photobooth`'s "send" button and the `/wall` page will
show a friendly notice instead of erroring out — everything else in the site
works fine without it.

## 3. Add background music for the wall

Drop an mp3 into `public/music/` and point `wall.musicSrc` in `lib/content.js`
at it, e.g. `/music/wall-song.mp3`. The play/pause button on `/wall` won't do
anything (and will visibly disable itself) until a real file is there.

## 4. Passwords: the wall, and your private moderation page

Two static passwords, both set in `lib/content.js`:

- **`wall.password`** — Viktor needs this to open `/wall`. It defaults to his
  birthday as MMDDYYYY (`09031996`). Change it in `lib/content.js` if you'd
  rather use something else.
- **`adminConfig.password`** — gates a page only you should know about:
  **`/admin`**. It's not linked from anywhere in the site on purpose — you'll
  just navigate to `https://your-site.vercel.app/admin` directly. There you
  can see every photo + message sent to the wall and delete any of them.
  **Change this from the default (`changeme-admin`) before sharing the site.**

Both of these are simple, static checks done in the browser — enough to keep
casual visitors out, but not real authentication. Someone who really wanted to
could get around them via browser devtools. That's a fine trade-off for a
private birthday project; just don't rely on it for anything more sensitive.

Once you enter a password correctly on a device, it stays unlocked for that
browser tab's session (closing the tab/browser resets it).

## 5. The photobooth's layouts, frames, and stickers

**Capturing:** the "Select a frame" screen, after taking photos, offers a
gallery of pre-designed frame artwork first (see below), plus a "Custom
colors & stickers" card that switches to a plain color background you
decorate yourself by dragging stickers onto it.

- **Photo layouts** (2×6 strip of 3 or 4, 4×6 portrait/landscape): edit the
  `gridLayouts` array in `lib/gridLayouts.js`. These show up in the Grid
  menu on the capture screen.
- **Pre-designed frames** are real artwork files in `public/frames/`,
  registered in `lib/frames.js`. Each entry has:
  - `count` — only shows up as an option when that many photos were taken
    (these are all designed for the 2×6" strips, not the single 4×6 photos).
  - `bgImage` — the PNG path.
  - `cells` — the exact position of each photo window, as fractions (0–1) of
    the image, measured from the artwork so photos line up pixel-perfect.
  - `overlay` — `false` (default) treats the image as a background with
    photos drawn on top, exactly filling each window. Use `true` instead if
    you export a **transparent** PNG (art opaque, windows transparent) —
    then photos are drawn first and the art layers on top, which lets
    decorations overlap the photo edges properly (see below).
- **Frame colors** (the plain backgrounds in "Custom colors"): edit the
  `frameColors` array in `lib/frameColors.js`.
- **Draggable stickers**: edit the `stickers` array in `lib/stickers.js`
  (still emoji-based).

### Adding your own frame designs

1. Export a flat PNG, ideally **600×1800px** (2×6" at 300dpi — matches the
   strip aspect exactly), with **pure white** rectangles where each photo
   should show through.
2. Drop it in `public/frames/`.
3. Add an entry to `lib/frames.js` with the right `count` and the `cells`
   for each window's position. If you're not sure of the exact numbers,
   send the file back and ask to have the windows measured from it directly
   — that's how the current 8 were done (down to a few decimal places, no
   guessing).

The 8 already in the project (Cat Pattern, Candy Party, Pink Floral, Vintage
Scrapbook, Cloud & Hearts, Pink Gingham, Retro Pixel, Music Notes) are your
uploaded designs — nothing left to do for those. One thing worth checking:
a couple of them have a date baked into the artwork itself (e.g. "Sept. 7,
2026") that doesn't match `site.birthdayDisplayDate` in `lib/content.js`
("Sept. 3, 2026") — that's just because it's baked into the image, so if you
want it to match, re-export those specific files with the date you want.

## 6. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The photobooth needs camera access, which
browsers only allow over `https://` or `localhost` — both are fine for
testing.

## 7. Deploy it (so the link actually works for him and his friends)

The easiest option is [Vercel](https://vercel.com):

1. Push this project to a GitHub repo (or use `vercel` CLI directly from this
   folder).
2. Import it at vercel.com → New Project → select the repo.
3. Add the six `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local`
   under **Environment Variables** before deploying (or in Project Settings
   afterward, then redeploy).
4. Deploy. You'll get a URL like `https://your-project.vercel.app`.

That's the link you send him for the notification/surprise, and the
"copy photobooth link" button on the surprise page will automatically point
friends to `https://your-project.vercel.app/photobooth`.

## Notes

- Everything is mobile-first and works on desktop too.
- The mic-based "blow out candles" feature needs microphone permission; the
  tap-to-blow button always works as a fallback.
- Photos sent to the wall are compressed client-side before upload to stay
  well under Firestore's per-document size limit — expect a small quality
  drop compared to the locally downloaded copy.
- Aside from the wall (which needs Firestore, see step 2), the rest of the
  site needs no backend or API keys.
