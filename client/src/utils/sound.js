// Small WebAudio helper to play tones without external files
export function playTone(freq = 440, duration = 0.18, type = "sine") {
  try {
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
