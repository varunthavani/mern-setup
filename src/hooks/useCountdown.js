import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 864e5),
    hours: Math.floor((ms / 36e5) % 24),
    minutes: Math.floor((ms / 6e4) % 60),
    seconds: Math.floor((ms / 1e3) % 60),
  };
}

/** Live countdown that never goes negative. */
export function useCountdown(target) {
  const [state, setState] = useState(() => diff(target));
  useEffect(() => {
    setState(diff(target));
    if (diff(target).done) return undefined;
    let id;
    const tick = () => {
      const next = diff(target);
      setState(next);
      if (!next.done) id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(id);
  }, [target]);
  return state;
}
