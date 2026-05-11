#!/usr/bin/env python3
"""Auto-cut silences from MP4 videos while keeping A/V in sync.

For each input video:
  1. Run ffmpeg `silencedetect` to find silence ranges above the threshold.
  2. Pad each silence inward (keep ~0.15s breathing room on each side).
  3. Build the inverse list of keep-segments (between silences).
  4. Concat keep-segments with `trim`+`atrim` filter_complex into one MP4.
"""
from __future__ import annotations
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

SILENCE_THRESHOLD_DB = -32        # quieter than this is "silence"
MIN_SILENCE_DURATION = 0.7        # only cut silences this long or longer
KEEP_PAD = 0.15                   # leave this many seconds of breathing room
MIN_KEEP_DURATION = 0.25          # discard keep-segments shorter than this


def probe_duration(path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1",
        str(path),
    ], text=True).strip()
    return float(out)


def detect_silences(path: Path) -> list[tuple[float, float]]:
    """Return list of (silence_start, silence_end) ranges in seconds."""
    proc = subprocess.run([
        "ffmpeg", "-hide_banner", "-nostats",
        "-i", str(path),
        "-af", f"silencedetect=noise={SILENCE_THRESHOLD_DB}dB:d={MIN_SILENCE_DURATION}",
        "-f", "null", "-",
    ], capture_output=True, text=True)
    log = proc.stderr
    starts = [float(m) for m in re.findall(r"silence_start: ([0-9.]+)", log)]
    ends = [float(m) for m in re.findall(r"silence_end: ([0-9.]+)", log)]
    n = min(len(starts), len(ends))
    return list(zip(starts[:n], ends[:n]))


def keep_segments(duration: float, silences: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Build keep ranges: full duration minus padded silences, dropping tiny pieces."""
    cuts = []
    for s_start, s_end in silences:
        cut_start = s_start + KEEP_PAD
        cut_end = s_end - KEEP_PAD
        if cut_end > cut_start:
            cuts.append((cut_start, cut_end))

    keep = []
    cursor = 0.0
    for cs, ce in cuts:
        if cs > cursor:
            keep.append((cursor, cs))
        cursor = ce
    if cursor < duration:
        keep.append((cursor, duration))

    return [(a, b) for a, b in keep if (b - a) >= MIN_KEEP_DURATION]


def build_filter_complex(keeps: list[tuple[float, float]]) -> str:
    """Build a filter_complex that trims each keep range and concats them."""
    parts = []
    for i, (a, b) in enumerate(keeps):
        parts.append(f"[0:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS[v{i}]")
        parts.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS[a{i}]")
    chain = ";".join(parts)
    inputs = "".join(f"[v{i}][a{i}]" for i in range(len(keeps)))
    chain += f";{inputs}concat=n={len(keeps)}:v=1:a=1[v][a]"
    return chain


def cut(input_path: Path, output_path: Path) -> dict:
    duration = probe_duration(input_path)
    silences = detect_silences(input_path)
    keeps = keep_segments(duration, silences)

    if not silences:
        # no work — just copy
        subprocess.check_call([
            "ffmpeg", "-y", "-i", str(input_path),
            "-c", "copy", "-movflags", "+faststart",
            str(output_path),
        ])
        return {
            "in": str(input_path), "out": str(output_path),
            "in_duration": duration, "out_duration": duration,
            "silences": [], "keeps": [(0.0, duration)], "saved": 0.0,
        }

    fc = build_filter_complex(keeps)
    subprocess.check_call([
        "ffmpeg", "-y",
        "-i", str(input_path),
        "-filter_complex", fc,
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "22",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        str(output_path),
    ])
    new_duration = probe_duration(output_path)
    return {
        "in": str(input_path), "out": str(output_path),
        "in_duration": duration, "out_duration": new_duration,
        "silences": silences, "keeps": keeps, "saved": duration - new_duration,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+", type=Path)
    ap.add_argument("--out-dir", type=Path, required=True)
    ap.add_argument("--report", type=Path, default=None)
    args = ap.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    report = []
    for src in args.inputs:
        dst = args.out_dir / src.name
        info = cut(src, dst)
        print(f"  → {src.name}: {info['in_duration']:.2f}s → {info['out_duration']:.2f}s "
              f"(saved {info['saved']:.2f}s, kept {len(info['keeps'])} segs)")
        report.append(info)

    if args.report:
        args.report.write_text(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
