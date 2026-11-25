/** Golden confetti + rose petals (canvas-confetti, loaded on demand). */
export async function celebrate(origin = { x: 0.5, y: 0.5 }) {
  const { default: confetti } = await import("canvas-confetti");
  const petal = confetti.shapeFromPath
    ? confetti.shapeFromPath({ path: "M0 -10 C8 -6 7 6 0 10 C-7 6 -8 -6 0 -10Z" })
    : "circle";
  const gold = ["#F3DFA6", "#E9CF8E", "#B58A45", "#D9BC7A", "#FFF5E5"];
  const rose = ["#F3C6C4", "#E8B4B1", "#DDA5A4", "#F7D9D6"];
  const lite = (navigator.hardwareConcurrency || 8) <= 4;
  const base = { origin, disableForReducedMotion: true, zIndex: 60 };
  confetti({ ...base, particleCount: lite ? 50 : 110, spread: 80, startVelocity: 38, colors: gold, scalar: 0.9, ticks: 220 });
  confetti({ ...base, particleCount: lite ? 20 : 40, spread: 120, startVelocity: 26, colors: rose, shapes: [petal], scalar: 1.4, gravity: 0.6, drift: 0.4, ticks: 320 });
  setTimeout(() => {
    confetti({ ...base, particleCount: lite ? 20 : 50, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: gold });
    confetti({ ...base, particleCount: lite ? 20 : 50, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: gold });
  }, 250);
}
