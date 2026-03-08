// Web Audio API sound effects — no external files needed

const audioCtx = () => {
  if (!(window as any).__waterAudioCtx) {
    (window as any).__waterAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__waterAudioCtx as AudioContext;
};

export function playDrinkSound() {
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Bubbly water drop sound
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);

  // Second bubble
  setTimeout(() => {
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(800, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.15);
  }, 100);
}

export function playGoalSound() {
  const ctx = audioCtx();
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.3);
  });
}

export function playLevelUpSound() {
  const ctx = audioCtx();
  const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.25);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.25);
  });
}
