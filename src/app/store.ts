export const loadingStore = {
  progress: 0,
  revealing: false,
  animatingOut: false,
  transitionStarted: false,
  reduceMotion: false,
  listeners: new Set<() => void>(),
  set(progress: number, revealing: boolean, reduceMotion: boolean, animatingOut = false) {
    this.progress = progress;
    this.revealing = revealing;
    this.reduceMotion = reduceMotion;
    if (animatingOut) this.animatingOut = animatingOut;
    this.listeners.forEach((l) => l());
  },
  setAnimatingOut(val: boolean) {
    this.animatingOut = val;
    this.listeners.forEach((l) => l());
  },
  setTransitionStarted(val: boolean) {
    this.transitionStarted = val;
    this.listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }
};
