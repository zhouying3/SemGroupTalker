"use strict";

document.querySelectorAll(".playback-controls[data-video]").forEach((controls) => {
  const video = document.getElementById(controls.dataset.video);
  if (!(video instanceof HTMLVideoElement)) return;

  const figure = controls.closest(".video-figure");
  const panel = figure.querySelector(".keyframe-controls");
  const momentButtons = panel.querySelector(".keyframe-buttons");
  const momentCaption = panel.querySelector("[data-moment-caption]");
  const momentTitle = panel.querySelector("[data-moment-title]");
  const momentDescription = panel.querySelector("[data-moment-description]");
  const status = figure.querySelector("[data-playback-status]");
  const speedButtons = controls.querySelectorAll("button[data-rate]");
  let moments = [];
  let renderedButtons = [];
  let pending = null;
  let activeMoment = null;

  const showStatus = (message = "") => {
    status.textContent = message;
    status.hidden = !message;
  };

  const updateSpeed = () => {
    speedButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.rate) === video.playbackRate));
    });
  };
  speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      video.playbackRate = Number(button.dataset.rate);
      updateSpeed();
    });
  });
  video.defaultPlaybackRate = 1;
  video.playbackRate = 1;
  video.addEventListener("ratechange", updateSpeed);
  updateSpeed();
  controls.hidden = false;

  const selectMoment = (moment) => {
    if (activeMoment === moment) return;
    activeMoment = moment;
    renderedButtons.forEach(({ button, item }) => {
      button.setAttribute("aria-pressed", String(item === moment));
    });
    momentCaption.hidden = !moment;
    momentTitle.textContent = moment ? `${moment.id} · ${moment.identity} — ${moment.title}` : "";
    momentDescription.textContent = moment ? moment.description : "";
  };

  const updateMoment = () => {
    const moment = moments.find((item) => video.currentTime >= item.holdStart && video.currentTime < item.holdEnd);
    selectMoment(moment || null);
  };
  video.addEventListener("timeupdate", updateMoment);
  video.addEventListener("seeked", updateMoment);
  video.addEventListener("playing", () => showStatus());

  // Wait for media readiness or a confirmed seek, cleaning up every listener.
  const waitForMedia = (eventName, check, signal, action = () => {}) => new Promise((resolve, reject) => {
    let finished = false;
    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener(eventName, onEvent);
      video.removeEventListener("error", onError);
      signal.removeEventListener("abort", onAbort);
    };
    const finish = (error) => {
      if (finished) return;
      finished = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const onEvent = () => { if (check()) finish(); };
    const onError = () => finish(new Error("Media unavailable"));
    const onAbort = () => finish(new DOMException("Cancelled", "AbortError"));
    const timeout = setTimeout(() => finish(new Error("Media loading timeout")), 20000);
    video.addEventListener(eventName, onEvent);
    video.addEventListener("error", onError);
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) { onAbort(); return; }
    if (video.error) { onError(); return; }
    try {
      action();
      onEvent();
    } catch (error) {
      finish(error);
    }
  });

  const waitForMetadata = (signal) => waitForMedia(
    "loadedmetadata", () => video.readyState >= HTMLMediaElement.HAVE_METADATA, signal,
    () => { if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load(); },
  );

  const seekTo = async (target, signal) => {
    await waitForMetadata(signal);
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    if (!Number.isFinite(video.duration) || target < 0 || target >= video.duration) {
      throw new Error("Moment outside video duration");
    }
    await waitForMedia(
      "seeked", () => !video.seeking && Math.abs(video.currentTime - target) < 0.1, signal,
      () => { video.currentTime = target; },
    );
  };

  const beginAction = (kind) => {
    if (pending) pending.controller.abort();
    const request = { kind, controller: new AbortController() };
    pending = request;
    showStatus();
    return request;
  };

  const inspectMoment = async (moment) => {
    const request = beginAction("moment");
    const { signal } = request.controller;
    video.pause();
    try {
      await seekTo(moment.holdStart + 0.2, signal);
      if (signal.aborted || pending !== request) return;
      video.pause();
      selectMoment(moment);
    } catch (error) {
      if (!signal.aborted) showStatus(video.error
        ? "This video could not be loaded. Try reloading the page."
        : "This moment is still loading. Try again or use the video controls.");
    } finally {
      if (pending === request) pending = null;
    }
  };

  controls.querySelector("[data-play-start]").addEventListener("click", async () => {
    const request = beginAction("start");
    const { signal } = request.controller;
    video.pause();
    try {
      await seekTo(0, signal);
      if (signal.aborted || pending !== request) return;
      selectMoment(null);
      await video.play();
    } catch (error) {
      if (!signal.aborted) showStatus(video.error
        ? "This video could not be loaded. Try reloading the page."
        : "Use the video's play control to continue from the selected position.");
    } finally {
      if (pending === request) pending = null;
    }
  });

  // A native play action takes precedence over a pending keyframe jump.
  video.addEventListener("play", () => {
    if (!video.paused && pending && pending.kind === "moment") pending.controller.abort();
  });

  const validMoment = (item) => item && typeof item === "object"
    && ["id", "title", "description", "identity"].every((key) => typeof item[key] === "string" && item[key].trim())
    && /^T\d+$/.test(item.id)
    && ["sourceTime", "videoTime", "holdStart", "holdEnd"].every((key) => Number.isFinite(item[key]) && item[key] >= 0)
    && item.holdEnd > item.holdStart + 0.2;

  const loadMoments = async () => {
    try {
      const response = await fetch(panel.dataset.keyframes, { credentials: "same-origin" });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data) || !data.length || !data.every(validMoment)) return;
      if (new Set(data.map((item) => item.id)).size !== data.length) return;
      moments = [...data].sort((a, b) => a.holdStart - b.holdStart);
      const fragment = document.createDocumentFragment();
      renderedButtons = moments.map((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${item.id} · ${item.identity}`;
        button.title = item.title;
        button.setAttribute("aria-label", `${item.id}: ${item.title}, ${item.identity}`);
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => inspectMoment(item));
        fragment.append(button);
        return { button, item };
      });
      momentButtons.replaceChildren(fragment);
      panel.hidden = false;
      updateMoment();
    } catch (error) {
      // Missing or invalid optional metadata must not affect native playback.
      panel.hidden = true;
    }
  };
  loadMoments();
});
