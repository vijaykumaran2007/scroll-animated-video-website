'use client';

import { useEffect, useRef, useState } from 'react';

// ── CONFIG ────────────────────────────────────────────────
const VIDEO_SRC      = '/Firefly A small, round, fluffy orange creature with huge white eyes and a tiny black nose stands com.mp4';
const VIDEO_DURATION = 5.042;
const LERP_FACTOR    = 0.12;
const TOTAL_FRAMES   = 121;   // 24fps × 5s — matches source, no interpolation needed
const BITMAP_SCALE   = 0.75;  // store bitmaps at 75% size — ~120 MB RAM, near-source clarity
                               // vs 0.5 = ~55 MB (slightly soft) | 1.0 = ~500 MB (pixel-perfect)

export default function CreatureTracker() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const videoRef       = useRef<HTMLVideoElement | null>(null);
  const framesRef      = useRef<ImageBitmap[]>([]);
  const targetIdxRef   = useRef(TOTAL_FRAMES / 2);
  const currentIdxRef  = useRef(TOTAL_FRAMES / 2);
  const rafRef         = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady]       = useState(false);

  // ── Extract frames from video sequentially ────────────
  useEffect(() => {
    let cancelled = false;

    const video = document.createElement('video');
    videoRef.current = video;
    video.src       = VIDEO_SRC;
    video.muted     = true;
    video.preload   = 'auto';
    video.playsInline = true;

    const offscreen = document.createElement('canvas');
    const ctx       = offscreen.getContext('2d')!;

    const extractFrames = async () => {
      await new Promise<void>((resolve) => {
        video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        video.load();
      });

      offscreen.width  = video.videoWidth;
      offscreen.height = video.videoHeight;

      const captured: ImageBitmap[] = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (cancelled) return;

        const time = (i / (TOTAL_FRAMES - 1)) * VIDEO_DURATION;

        await new Promise<void>((resolve) => {
          video.currentTime = time;
          video.addEventListener('seeked', () => resolve(), { once: true });
        });

        ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
        const bitmap = await createImageBitmap(offscreen, {
          resizeWidth:   Math.round(offscreen.width  * BITMAP_SCALE),
          resizeHeight:  Math.round(offscreen.height * BITMAP_SCALE),
          resizeQuality: 'high',
        });
        captured.push(bitmap);

        if (!cancelled) setProgress(Math.round((i / TOTAL_FRAMES) * 100));
      }

      framesRef.current = captured;
      if (!cancelled) {
        setProgress(100);
        setReady(true);
      }
    };

    extractFrames().catch(console.error);

    return () => {
      cancelled = true;
      video.src = '';
      framesRef.current.forEach((b) => b?.close());
    };
  }, []);

  // ── Canvas render loop ────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);

      currentIdxRef.current +=
        (targetIdxRef.current - currentIdxRef.current) * LERP_FACTOR;

      const idx   = Math.round(currentIdxRef.current);
      const safe  = Math.min(Math.max(idx, 0), TOTAL_FRAMES - 1);
      const frame = framesRef.current[safe];
      if (!frame) return;

      const scaleX = canvas.width  / frame.width;
      const scaleY = canvas.height / frame.height;
      const scale  = Math.max(scaleX, scaleY);
      const w = frame.width  * scale;
      const h = frame.height * scale;
      const x = (canvas.width  - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frame, x, y, w, h);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [ready]);

  // ── Mouse / Touch / Gyroscope input ──────────────────
  const [needsGyroPermission, setNeedsGyroPermission] = useState(false);
  const gyroActiveRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

    const updateTarget = (ratio: number) => {
      targetIdxRef.current = Math.min(Math.max(ratio, 0), 1) * (TOTAL_FRAMES - 1);
    };

    const onMouse = (e: MouseEvent) => updateTarget(e.clientX / window.innerWidth);

    const onTouch = (e: TouchEvent) => {
      if (!gyroActiveRef.current && e.touches.length > 0)
        updateTarget(e.touches[0].clientX / window.innerWidth);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return;
      const clamped = Math.min(Math.max(e.gamma, -45), 45);
      updateTarget((clamped + 45) / 90);
      gyroActiveRef.current = true;
    };

    const attachGyro = () =>
      window.addEventListener('deviceorientation', onOrientation, { passive: true });

    const tryGyro = async () => {
      if (!isTouchDevice()) return;
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof DOE.requestPermission === 'function') {
        setNeedsGyroPermission(true);
      } else {
        attachGyro();
      }
    };

    tryGyro();
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    (window as unknown as Record<string, unknown>).__attachGyro = attachGyro;

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, []);

  const requestGyroPermission = async () => {
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === 'function') {
      const result = await DOE.requestPermission();
      if (result === 'granted') {
        (window as unknown as Record<string, unknown>).__attachGyro?.();
        setNeedsGyroPermission(false);
      }
    }
  };

  return (
    <>
      {/* Loading overlay */}
      {!ready && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 10, gap: '16px',
        }}>
          <div style={{
            width: '200px', height: '2px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '999px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: '#fff', borderRadius: '999px',
              transition: 'width 0.1s ease',
            }} />
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '12px',
            fontFamily: 'monospace', letterSpacing: '0.05em',
          }}>
            Loading {progress}%
          </p>
        </div>
      )}

      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0, display: 'block',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* iOS gyroscope permission button */}
      {needsGyroPermission && ready && (
        <button
          onClick={requestGyroPermission}
          style={{
            position: 'fixed', bottom: '32px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 20,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            padding: '12px 24px', borderRadius: '999px',
            cursor: 'pointer', letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          Enable tilt to control
        </button>
      )}
    </>
  );
}
