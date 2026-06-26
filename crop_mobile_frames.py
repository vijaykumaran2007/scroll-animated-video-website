import cv2
import os
import sys

VIDEO_PATH   = "public/creature.mp4"
OUTPUT_DIR   = "public/frames_mobile"
WEBP_QUALITY = 85  # Slightly lower quality to save bandwidth on mobile

def crop_mobile_frames():
    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        print(f"❌ Could not open video: {VIDEO_PATH}")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Extracting {total_frames} cropped mobile frames...")

    extracted = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Video is 1280x720. Creature is at ~66% width (x = 845).
        # We want a 9:16 aspect ratio. Height is 720, so width should be 405.
        # Crop region: x from 642 to 1047.
        cropped = frame[0:720, 642:1047]
        
        filename = os.path.join(OUTPUT_DIR, f"frame_{extracted:04d}.webp")
        cv2.imwrite(filename, cropped, [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY])
        
        extracted += 1
        print(f"\r  Extracted {extracted}/{total_frames} frames", end="")

    cap.release()
    print(f"\nDone! Saved {extracted} frames to {OUTPUT_DIR}")

if __name__ == "__main__":
    crop_mobile_frames()
