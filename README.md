# SemGroupTalker

**SemGroupTalker: Coarse-to-Fine Gaussian Motion with Semantic Initialization for Talking Head Synthesis under Unseen Audio**

Project page: https://zhouying3.github.io/SemGroupTalker/

Academic project page. The title, complete abstract, method overview and its caption, and downloadable paper are synchronized with the author-provided manuscript on September 28, 2026.

The static project page has three content sections:

1. Method overview and the paper abstract.
2. One synchronized reconstruction comparison video. Five selected moments (T1–T5) add ground-truth references, mouth close-ups, and reconstruction error maps on a common color scale.
3. One synchronized unseen-audio comparison video. Four selected moments (T1–T4) add mouth close-ups for inspecting articulation and speech timing.

Both videos show SemGroupTalker (Ours) together with all five comparison methods: ER-NeRF, TalkingGaussian, GaussianTalker, InsTaG, and InsTaG++. Each player has native video controls and 0.25×, 0.5×, and 1× playback options. Playback starts only when the visitor chooses to play. The paper PDF remains linked from the page.

The two videos include encoded 2-second freeze frames and synchronized audio pauses at the selected moments. This duration is measured at 1× speed; slower playback also lengthens the pauses. JavaScript does not insert additional pauses. The ordinary video frames prioritize the six method views, while the encoded freeze frames provide the local explanations.

Each player loads its own optional keyframe metadata and renders a button for each selected moment. Clicking a moment pauses the player, seeks to `holdStart + 0.2` after metadata is available, confirms the seek, and shows that moment's description. `Play from start` starts the complete video from the beginning at the selected playback speed. Keyframe IDs are scoped to each player, so T1 in one video cannot control the other video. Native playback and speed controls remain usable when keyframe metadata cannot be loaded.

## Page assets

- `assets/method.png`
- `assets/paper.pdf`
- `assets/reconstruction-comparison.mp4`
- `assets/reconstruction-poster.jpg`
- `assets/reconstruction-keyframes.json`
- `assets/ood-comparison.mp4`
- `assets/ood-poster.jpg`
- `assets/ood-keyframes.json`

Each keyframe JSON file is an array of objects containing `id`, `title`, `description`, `sourceTime`, `videoTime`, `holdStart`, `holdEnd`, and `identity`. Times are in seconds; `sourceTime` is relative to the original clip, and `holdStart`/`holdEnd` identify the freeze frame in the rendered video's timeline. Metadata is rendered as plain text. The selected moment buttons remain hidden until valid metadata is available.

Video, poster, keyframe JSON, CSS, and player-script URLs use `?v=keyframes20260928` to refresh cached assets. The manuscript section retains its existing `?v=20260928` references.

Publish `index.html`, `styles.css`, `player.js`, and the page assets from the repository root using GitHub Pages.

## Local preview

From the repository directory, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/> in a web browser.

All site assets use relative paths, so the page also works under a GitHub Pages project URL such as `/SemGroupTalker/`.
