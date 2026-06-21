# Mobile Interaction Ideas — Creature Tracker

A collection of ideas for making the mouse-tracking creature work on mobile devices where there is no cursor.

---

## 🥇 1. Gyroscope / Device Tilt *(Best pick — implemented)*

Use `DeviceOrientationEvent` — when the user tilts their phone left/right, the creature's head follows. Feels completely magical with zero effort from the user.

**How it works:**
- `event.gamma` = left/right tilt angle, roughly **-45° to +45°**
- Normalize it to a 0–1 ratio and map to the frame index

```js
window.addEventListener('deviceorientation', (e) => {
  const ratio = (e.gamma + 45) / 90; // normalize to 0–1
  targetIdxRef.current = ratio * (TOTAL_FRAMES - 1);
});
```

> ⚠️ Requires a one-time permission prompt on **iOS 13+** via `DeviceOrientationEvent.requestPermission()`

**Pros:** No UI needed, feels alive, very surprising  
**Cons:** iOS needs permission tap, some Android devices have noisy gyros

---

## 🥈 2. Face Tracking with Camera

Use **TensorFlow.js `face-landmarks-detection`** — the front camera detects where the user's face is positioned on screen. The creature looks wherever the face is.

**How it works:**
- Load TensorFlow.js + face model (~300kb)
- Get webcam stream via `getUserMedia`
- On each frame, detect face X centroid → map to creature frame index

**Pros:** Most impressive, feels like magic  
**Cons:** Heavy (~300kb JS), requires camera permission, slight latency

---

## 🥉 3. Touch Drag / Swipe

Already half-implemented via `touchmove`. Make it more intentional with a visible drag handle the user swipes left/right.

**How it works:**
- Show a pill-shaped handle at the bottom of the screen
- Map `touch.clientX` drag delta to frame index

**Pros:** Familiar UX, no permissions needed, works everywhere  
**Cons:** Less magical, requires deliberate user action

---

## 4. Scroll-Linked

Map the creature's head turn to **page scroll position**. As the user scrolls down through the portfolio, the creature gradually turns from left to right — great for storytelling.

```js
window.addEventListener('scroll', () => {
  const ratio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  targetIdxRef.current = ratio * (TOTAL_FRAMES - 1);
});
```

**Pros:** Ties into portfolio narrative, no extra UI  
**Cons:** Only works when page has scrollable content

---

## 5. Idle Auto-Animation

If no interaction is detected for 3 seconds, the creature slowly looks around on its own using a sine wave — like a living idle state. Snaps back to user control on any touch.

```js
// Gentle idle oscillation
const idleFrame = ((Math.sin(Date.now() / 1000) + 1) / 2) * (TOTAL_FRAMES - 1);
```

**Pros:** Always alive even without interaction, great fallback  
**Cons:** Not interactive, purely decorative

---

## Recommended Strategy by Device

| Device        | Best Option              |
|---------------|--------------------------|
| Mobile        | Gyroscope (tilt)         |
| Tablet        | Touch drag               |
| Desktop       | Mouse tracking (current) |
| No gyro / old phone | Idle auto-animation |

---

## Implementation Priority

1. ✅ Mouse tracking — done
2. ✅ Touch tracking — done (basic)
3. 🔄 Gyroscope — implemented alongside this doc
4. ⬜ Idle fallback — next step
5. ⬜ Face tracking — future enhancement
6. ⬜ Scroll-linked — depends on portfolio layout
