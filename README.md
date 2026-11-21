# OwO Random GIF API

A small Vercel project that serves paired side/bottom images for OwO custom embeds.

## Included categories

battle_win, battle_tie, battle_loss, hunt, pray, curse, kill, hug, kiss, pat, slap, cuddle, bite, lick, punch, poke, cry, dance, wave, wink, feed, highfive

## How pairing works

Each category has entries in `data/gifs.json`. Every entry represents one matching pair:
- `side`: file shown in the OwO side-image field
- `bottom`: matching file shown in the OwO bottom-image field

The API routes are:

- `/api/<category>/side`
- `/api/<category>/bottom`

Both endpoints hash the same category and current five-minute time slot, so they choose the same pair when requested within the same slot.

**Boundary limitation:** If Discord requests the side image just before a five-minute boundary and the bottom image just after it, they can select different pairs. With two fixed independent URLs and no shared request/session identifier, strict per-embed synchronisation cannot be guaranteed while rotating randomly.

## 1. Add your GIFs

For example, in `public/gifs/battle_win/`, upload:

- `side-01.gif`
- `bottom-01.gif`
- `side-02.gif`
- `bottom-02.gif`

Keep each side/bottom pair on the same theme. Repeat in the relevant category folder.

## 2. Update `data/gifs.json`

The starter JSON contains two example pairs per category. Keep the filenames exactly the same as the files you upload. Remove any example pair you have not uploaded yet, or the API may redirect to a missing file.

Example:

```json
"battle_win": [
  {
    "id": "pair-01",
    "side": "side-01.gif",
    "bottom": "bottom-01.gif"
  }
]
```

## 3. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import that repository at https://vercel.com/new.
3. Deploy with the default settings; no build command is required.
4. Your project URL will look like `https://your-project.vercel.app`.

## 4. Put these URLs in OwO

For a project domain of `https://your-project.vercel.app`:

- Side Image: `https://your-project.vercel.app/api/battle_win/side`
- Bottom Image: `https://your-project.vercel.app/api/battle_win/bottom`

Replace `battle_win` with the relevant category for each custom.

## Notes

- This project does not include GIF artwork; add your own GIF files.
- The API redirects to files hosted by Vercel from the Git repository.
- Large GIFs and high traffic can use up hosting bandwidth/usage limits.
- Use content you have permission to host.
