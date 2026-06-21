"""
extract_frames.py
─────────────────
Extracts every frame from a video file and saves them as WebP images
into public/frames/. The Next.js CreatureTracker component loads these
instead of scrubbing a video — making load time ~10x faster.

Usage:
    python extract_frames.py
"""

import cv2
import os
import sys

# ── CONFIG ────────────────────────────────────────────────
VIDEO_PATH   = "public/Firefly A small, round, fluffy orange creature with huge white eyes and a tiny black nose stands com.mp4"
OUTPUT_DIR   = "public/frames"
WEBP_QUALITY  = 85          # 0-100, higher = better quality
TARGET_FPS    = 24          # matches source video native FPS
RESIZE_WIDTH  = None        # no resize — keep original resolution
RESIZE_HEIGHT = None        # no resize — keep original resolution
# ─────────────────────────────────────────────────────────

def extract_frames(video_path, output_dir, quality, target_fps, resize_w=None, resize_h=None):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"❌ Could not open video: {video_path}")
        sys.exit(1)

    source_fps    = cap.get(cv2.CAP_PROP_FPS)
    total_frames  = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration      = total_frames / source_fps
    width         = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height        = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print(f"[VIDEO] {video_path}")
    print(f"   Size  : {width}x{height}")
    print(f"   FPS   : {source_fps:.2f}  |  Duration: {duration:.3f}s  |  Frames: {total_frames}")

    # Calculate which frame indices to extract
    if target_fps and target_fps < source_fps:
        step = source_fps / target_fps
        indices = set(round(i * step) for i in range(int(total_frames / step) + 1))
        indices = {min(i, total_frames - 1) for i in indices}
    else:
        indices = set(range(total_frames))

    os.makedirs(output_dir, exist_ok=True)

    extracted   = 0
    frame_index = 0

    print(f"\n[INFO] Extracting {len(indices)} frames -> {output_dir}/\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_index in indices:
            filename = os.path.join(output_dir, f"frame_{extracted:04d}.webp")
            # Resize if configured
            if resize_w and resize_h:
                frame = cv2.resize(frame, (resize_w, resize_h), interpolation=cv2.INTER_AREA)
            cv2.imwrite(filename, frame, [cv2.IMWRITE_WEBP_QUALITY, quality])
            extracted += 1

            # Progress bar
            pct = extracted / len(indices)
            bar = "#" * int(pct * 30) + "-" * (30 - int(pct * 30))
            print(f"\r  [{bar}] {extracted}/{len(indices)}  ({pct*100:.0f}%)", end="", flush=True)

        frame_index += 1

    cap.release()

    total_size = sum(
        os.path.getsize(os.path.join(output_dir, f))
        for f in os.listdir(output_dir)
        if f.endswith(".webp")
    ) / 1024 / 1024

    print(f"\n\n[DONE]")
    print(f"   Extracted : {extracted} frames")
    print(f"   Total size: {total_size:.2f} MB")
    print(f"   Duration  : {duration:.3f}s")
    print(f"\n[NEXT] Update CreatureTracker.tsx:")
    print(f"   TOTAL_FRAMES = {extracted}")
    print(f"   VIDEO_DURATION = {duration:.3f}")

if __name__ == "__main__":
    extract_frames(VIDEO_PATH, OUTPUT_DIR, WEBP_QUALITY, TARGET_FPS, RESIZE_WIDTH, RESIZE_HEIGHT)
