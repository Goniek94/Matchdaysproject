"use client";

import { useRef, useEffect } from "react";
import type { SpinPrize } from "@/types/features/spin-wheel.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpinWheelCanvasProps {
  prizes: SpinPrize[];
  rotation: number;
  isSpinning: boolean;
  size?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert hex color to slightly darker shade for segment border */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Draw the wheel onto a canvas element */
function drawWheel(
  canvas: HTMLCanvasElement,
  prizes: SpinPrize[],
  rotationDeg: number,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const segmentAngle = (2 * Math.PI) / prizes.length;
  const rotationRad = (rotationDeg * Math.PI) / 180;

  ctx.clearRect(0, 0, size, size);

  prizes.forEach((prize, i) => {
    const startAngle = rotationRad + i * segmentAngle - Math.PI / 2;
    const endAngle = startAngle + segmentAngle;
    const midAngle = startAngle + segmentAngle / 2;

    // ── Segment fill ──
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = prize.color;
    ctx.fill();

    // ── Segment border ──
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Emoji label ──
    const labelRadius = radius * 0.68;
    const lx = cx + labelRadius * Math.cos(midAngle);
    const ly = cy + labelRadius * Math.sin(midAngle);

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(midAngle + Math.PI / 2);

    // Emoji
    const emojiSize = Math.max(14, size / 18);
    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(prize.emoji, 0, 0);

    // Text label
    const textSize = Math.max(8, size / 30);
    ctx.font = `bold ${textSize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 3;
    ctx.textBaseline = "top";
    ctx.fillText(prize.label, 0, 2);

    ctx.restore();
  });

  // ── Outer ring ──
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // ── Center hub ──
  const hubRadius = size / 12;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubRadius);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#e5e7eb");
  ctx.beginPath();
  ctx.arc(cx, cy, hubRadius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── Center star icon ──
  ctx.font = `${hubRadius * 1.1}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "transparent";
  ctx.fillText("⚡", cx, cy);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SpinWheelCanvas({
  prizes,
  rotation,
  isSpinning,
  size = 320,
}: SpinWheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentRotRef = useRef(rotation);

  // Animate smoothly toward target rotation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const target = rotation;

    if (!isSpinning) {
      // Snap to final position
      currentRotRef.current = target % 360;
      drawWheel(canvas, prizes, currentRotRef.current);
      return;
    }

    const startRot = currentRotRef.current;
    const delta = target - startRot;
    const duration = 4500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRot + delta * eased;
      currentRotRef.current = current;

      drawWheel(canvas, prizes, current % 360);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentRotRef.current = target % 360;
        drawWheel(canvas, prizes, currentRotRef.current);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [rotation, isSpinning, prizes]);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawWheel(canvas, prizes, 0);
  }, [prizes]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-full drop-shadow-2xl"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
