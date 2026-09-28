# SemGroupTalker

**SemGroupTalker: Coarse-to-Fine Gaussian Motion with Semantic Initialization for Talking Head Synthesis under Unseen Audio**

Project page: https://zhouying3.github.io/SemGroupTalker/

Academic project page. The title, complete abstract, method overview and its caption, and downloadable paper are synchronized with the author-provided manuscript on September 28, 2026.

The static project page has three content sections:

1. Method overview and the paper abstract.
2. One synchronized reconstruction comparison video with ground-truth references, mouth close-ups, and error maps on a shared color scale.
3. One synchronized unseen-audio comparison video for comparing articulation and speech timing under the same driving audio.

Both videos show SemGroupTalker (Ours) together with all five comparison methods: ER-NeRF, TalkingGaussian, GaussianTalker, InsTaG, and InsTaG++. Face views retain fixed positions and a consistent size, with method labels kept in place. Reference and mouth details are presented alongside these views.

Each player provides native video controls, `Play from start`, and 0.25×, 0.5×, and 1× playback options. `Play from start` begins the full video at the current playback speed. Playback begins only when the visitor chooses to play. The paper PDF remains linked from the page.

## Page assets

- `assets/method.png`
- `assets/paper.pdf`
- `assets/reconstruction-comparison.mp4`
- `assets/reconstruction-poster.jpg`
- `assets/ood-comparison.mp4`
- `assets/ood-poster.jpg`

Video, poster, CSS, and player-script URLs use `?v=stable20260928` to refresh cached assets. The manuscript section retains its existing `?v=20260928` references.

Publish `index.html`, `styles.css`, `player.js`, and the page assets from the repository root using GitHub Pages.

## Local preview

From the repository directory, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/> in a web browser.

All site assets use relative paths, so the page also works under a GitHub Pages project URL such as `/SemGroupTalker/`.
