# SemGroupTalker

**SemGroupTalker: Coarse-to-Fine Gaussian Motion with Semantic Initialization for Talking Head Synthesis under Unseen Audio**

Project page: https://zhouying3.github.io/SemGroupTalker/

Academic project page. The title, complete abstract, method overview and its caption, and downloadable paper are synchronized with the author-provided manuscript on September 28, 2026.

The static project page has three content sections:

1. Method overview and the paper abstract.
2. One synchronized reconstruction comparison video, with ground-truth frames, shared mouth crops, and reconstruction error maps using a common color scale.
3. One synchronized unseen-audio comparison video for inspecting mouth motion and speech timing.

Both videos show SemGroupTalker (Ours) together with all five comparison methods: ER-NeRF, TalkingGaussian, GaussianTalker, InsTaG, and InsTaG++. Each player has native video controls and 0.25×, 0.5×, and 1× playback options. Playback starts only when the visitor chooses to play. The paper PDF remains linked from the page.

## Page assets

- `assets/method.png`
- `assets/paper.pdf`
- `assets/reconstruction-comparison.mp4`
- `assets/reconstruction-poster.jpg`
- `assets/ood-comparison.mp4`
- `assets/ood-poster.jpg`

Publish `index.html`, `styles.css`, `player.js`, and the page assets from the repository root using GitHub Pages.

## Local preview

From the repository directory, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/> in a web browser.

All site assets use relative paths, so the page also works under a GitHub Pages project URL such as `/SemGroupTalker/`.
