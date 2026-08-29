"use client";

import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";

type Point = [number, number];

// Average spacing between stone centers, in CSS pixels. Larger = fewer, bigger stones.
const TARGET_CELL_SIZE = 92;
const RELAXATION_ITERATIONS = 2;
const CURSOR_GLOW_RADIUS = 260;
const FILL_ALPHA_MIN = 0.008;
const FILL_ALPHA_MAX = 0.022;
// How far each stone pulls in from its shared cell edge, opening a gap that
// reads as mortar/sand between stones. The range gives some stones a
// generous gap and others almost none, like a real hand-set path.
const INSET_MIN = 0.7;
const INSET_MAX = 0.92;
// Per-vertex radial wobble so a stone's outline isn't a scaled copy of a
// tidy polygon. It should look hand-shaped, not geometric.
const WOBBLE = 0.09;
const CREAM = "234, 224, 204";
const EMBER = "232, 130, 58";

function seedPoints(width: number, height: number): Point[] {
  const cols = Math.max(4, Math.round(width / TARGET_CELL_SIZE));
  const rows = Math.max(4, Math.round(height / TARGET_CELL_SIZE));
  const cellW = width / cols;
  const cellH = height / rows;
  const points: Point[] = [];

  for (let row = -1; row <= rows; row++) {
    for (let col = -1; col <= cols; col++) {
      const jitterX = (Math.random() - 0.5) * cellW * 0.85;
      const jitterY = (Math.random() - 0.5) * cellH * 0.85;
      points.push([
        col * cellW + cellW / 2 + jitterX,
        row * cellH + cellH / 2 + jitterY,
      ]);
    }
  }

  return points;
}

// Lloyd relaxation: nudge each point toward its cell's centroid so stones
// read as hand-set paving rather than a jittered grid.
function relax(points: Point[], bounds: [number, number, number, number]) {
  let relaxed = points;

  for (let i = 0; i < RELAXATION_ITERATIONS; i++) {
    const delaunay = Delaunay.from(relaxed);
    const voronoi = delaunay.voronoi(bounds);

    relaxed = relaxed.map((point, index) => {
      const polygon = voronoi.cellPolygon(index);
      if (!polygon) return point;

      let x = 0;
      let y = 0;
      let count = 0;
      for (const [px, py] of polygon) {
        x += px;
        y += py;
        count += 1;
      }
      return count ? ([x / count, y / count] as Point) : point;
    });
  }

  return relaxed;
}

function polygonCentroid(points: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

// Shrinks a Voronoi cell toward its own centroid, with a random inset and
// radial wobble per vertex, so it reads as a loose, rounded pebble sitting
// inside its allotted patch of ground rather than a tight polygon tile.
function pebbleFromCell(vertices: Point[]): Point[] {
  const [cx, cy] = polygonCentroid(vertices);

  return vertices.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const inset = INSET_MIN + Math.random() * (INSET_MAX - INSET_MIN);
    const wobble = 1 + (Math.random() - 0.5) * 2 * WOBBLE;
    const scale = inset * wobble;
    return [cx + dx * scale, cy + dy * scale] as Point;
  });
}

// Draws a smooth closed curve through a set of points using a Catmull-Rom
// spline (converted to cubic beziers). Unlike lineTo'ing between the points,
// this never produces a hard corner, which is what makes irregular polygon
// vertices actually read as a soft, rounded stone outline.
function traceSmoothClosedPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  const n = points.length;
  if (n < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, p2[0], p2[1]);
  }

  ctx.closePath();
}

function buildStaticLayer(width: number, height: number, dpr: number) {
  const margin = TARGET_CELL_SIZE;
  const bounds: [number, number, number, number] = [
    -margin,
    -margin,
    width + margin,
    height + margin,
  ];

  const points = relax(seedPoints(width, height), bounds);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi(bounds);

  const layer = document.createElement("canvas");
  layer.width = width * dpr;
  layer.height = height * dpr;
  const ctx = layer.getContext("2d");
  if (!ctx) return layer;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (let i = 0; i < points.length; i++) {
    const cell = voronoi.cellPolygon(i);
    if (!cell) continue;

    // d3-delaunay closes the ring by repeating the first point; drop it.
    const vertices = cell.slice(0, cell.length - 1) as Point[];
    if (vertices.length < 3) continue;

    const pebble = pebbleFromCell(vertices);

    const fillAlpha =
      FILL_ALPHA_MIN + Math.random() * (FILL_ALPHA_MAX - FILL_ALPHA_MIN);
    traceSmoothClosedPath(ctx, pebble);
    ctx.fillStyle = `rgba(${CREAM}, ${fillAlpha.toFixed(3)})`;
    ctx.fill();
  }

  return layer;
}

export default function CobbleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    let staticLayer: HTMLCanvasElement | null = null;

    const mouse = { x: -9999, y: -9999 };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const rebuild = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      staticLayer = buildStaticLayer(width, height, dpr);
    };

    const drawStatic = () => {
      if (!staticLayer) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(staticLayer, 0, 0, width, height);
    };

    const renderFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      if (staticLayer) {
        const breathe = 0.85 + 0.15 * ((Math.sin(time / 11000) + 1) / 2);
        ctx.globalAlpha = breathe;
        ctx.drawImage(staticLayer, 0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      if (
        mouse.x > -CURSOR_GLOW_RADIUS &&
        mouse.x < width + CURSOR_GLOW_RADIUS &&
        mouse.y > -CURSOR_GLOW_RADIUS &&
        mouse.y < height + CURSOR_GLOW_RADIUS
      ) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          CURSOR_GLOW_RADIUS,
        );
        gradient.addColorStop(0, `rgba(${EMBER}, 0.05)`);
        gradient.addColorStop(1, `rgba(${EMBER}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(
          mouse.x - CURSOR_GLOW_RADIUS,
          mouse.y - CURSOR_GLOW_RADIUS,
          CURSOR_GLOW_RADIUS * 2,
          CURSOR_GLOW_RADIUS * 2,
        );
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(renderFrame);
    };

    const stop = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (!reduceMotion) {
        start();
      }
    };

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        rebuild();
        if (reduceMotion) drawStatic();
      }, 150);
    };

    rebuild();

    if (reduceMotion) {
      drawStatic();
    } else {
      start();
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(20, 6, 9, 0.45) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
