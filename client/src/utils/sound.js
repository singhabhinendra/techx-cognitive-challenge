// Small WebAudio helper to play tones without external files
export function playTone(freq = 440, duration = 0.18, type = "sine") {
  try {
    const enabled = (() => {
      try {
        const v = localStorage.getItem("tx_audio");
        return v === null ? true : v === "1";
      } catch (e) {
        return true;
      }
    })();
    if (!enabled) return;
    const ctx = (playTone.ctx ||= new (window.AudioContext ||
      window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    setTimeout(() => {
      try {
        o.stop();
      } catch (e) {}
    }, duration * 1000 + 20);
  } catch (e) {
    // ignore if audio unavailable
  }
}

// Ensure an AudioContext exists and return it (safe no-throw wrapper)
export function ensureAudioContext() {
  try {
    return (playTone.ctx ||= new (window.AudioContext ||
      window.webkitAudioContext)());
  } catch (e) {
    return null;
  }
}

// Resume the AudioContext if it's suspended (returns a Promise)
export async function resumeAudioContext() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  } catch (e) {
    // swallow
  }
}
