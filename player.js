"use strict";

document.querySelectorAll(".playback-controls[data-video]").forEach((controls) => {
  const video = document.getElementById(controls.dataset.video);
  if (!(video instanceof HTMLVideoElement)) return;

  const figure = controls.closest(".video-figure");
  const status = figure.querySelector("[data-playback-status]");
  const speedButtons = controls.querySelectorAll("button[data-rate]");
  let pending = null;

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
      throw new Error("Playback position outside video duration");
    }
    await waitForMedia(
      "seeked", () => !video.seeking && Math.abs(video.currentTime - target) < 0.1, signal,
      () => { video.currentTime = target; },
    );
  };

  const beginAction = () => {
    if (pending) pending.controller.abort();
    const request = { controller: new AbortController() };
    pending = request;
    showStatus();
    return request;
  };

  controls.querySelector("[data-play-start]").addEventListener("click", async () => {
    const request = beginAction();
    const { signal } = request.controller;
    video.pause();
    try {
      await seekTo(0, signal);
      if (signal.aborted || pending !== request) return;
      await video.play();
    } catch (error) {
      if (!signal.aborted) showStatus(video.error
        ? "This video could not be loaded. Try reloading the page."
        : "Use the video's play control to continue.");
    } finally {
      if (pending === request) pending = null;
    }
  });

});
