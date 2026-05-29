"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { motion } from "framer-motion";

const SHAPE_TYPES = [
  "star",
  "circle",
  "cross",
  "triangle",
  "square",
  "diamond",
  "ring",
  "hexagon",
] as const;

type ShapeType = (typeof SHAPE_TYPES)[number];

const TRAJECTORIES = [
  "ltr",
  "rtl",
  "ttb",
  "btt",
  "diag-ne",
  "diag-nw",
  "diag-se",
  "diag-sw",
] as const;

type TrajectoryKind = (typeof TRAJECTORIES)[number];

const FILL_VARS = [
  "var(--decoration-star)",
  "var(--decoration-circle)",
  "var(--decoration-plus)",
  "var(--decoration-triangle)",
] as const;

export type NeobrutalistPageDecorationProps = {
  shapeCount?: number;
  seed?: number;
  showRadialGlow?: boolean;
};

type FloatingShape = {
  id: number;
  type: ShapeType;
  trajectory: TrajectoryKind;
  lane: number;
  size: number;
  rotation: number;
  fill: string;
  duration: number;
  delay: number;
  spin: boolean;
  spinDuration: number;
  hiddenOnMobile: boolean;
};

function round(value: number, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)]!;
}

function range(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}

function generateShapes(count: number, seed: number): FloatingShape[] {
  const rand = createSeededRandom(seed);

  return Array.from({ length: count }, (_, id) => {
    const type = pick(rand, SHAPE_TYPES);
    const spin = type === "cross" || type === "ring" || rand() > 0.65;

    return {
      id,
      type,
      trajectory: pick(rand, TRAJECTORIES),
      lane: round(range(rand, 8, 92)),
      size: Math.round(range(rand, 40, 96)),
      rotation: round(range(rand, -25, 25)),
      fill: pick(rand, FILL_VARS),
      duration: round(range(rand, 10, 20)),
      delay: round(range(rand, 0, 12)),
      spin,
      spinDuration: round(range(rand, 10, 18)),
      hiddenOnMobile: rand() > 0.5,
    };
  });
}

type BodyPath = {
  x: [number, number];
  y: [number, number];
};

function getBodyPath(
  shape: FloatingShape,
  width: number,
  height: number,
): BodyPath {
  const laneY = (shape.lane / 100) * height;
  const laneX = (shape.lane / 100) * width;
  const offX = -width * 0.14;
  const offY = -height * 0.14;
  const farX = width * 1.14;
  const farY = height * 1.14;

  switch (shape.trajectory) {
    case "ltr":
      return { x: [offX, farX], y: [laneY, laneY] };
    case "rtl":
      return { x: [farX, offX], y: [laneY, laneY] };
    case "ttb":
      return { x: [laneX, laneX], y: [offY, farY] };
    case "btt":
      return { x: [laneX, laneX], y: [farY, offY] };
    case "diag-ne":
      return { x: [offX, farX], y: [farY, offY] };
    case "diag-nw":
      return { x: [farX, offX], y: [farY, offY] };
    case "diag-se":
      return { x: [offX, farX], y: [offY, farY] };
    case "diag-sw":
      return { x: [farX, offX], y: [offY, farY] };
    default:
      return { x: [offX, farX], y: [laneY, laneY] };
  }
}

function useBodySize(containerRef: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef]);

  return size;
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function NeobrutalistShapeGraphic({
  type,
  fill,
}: {
  type: ShapeType;
  fill: string;
}) {
  const stroke = "var(--foreground)";
  const strokeWidth = 1.5;
  const shadow = { fill: "var(--foreground)", transform: "translate(2, 2)" };

  switch (type) {
    case "star":
      return (
        <>
          <path
            d="M12 0L14.5 9L24 12L14.5 15L12 24L9.5 15L0 12L9.5 9Z"
            {...shadow}
          />
          <path
            d="M12 0L14.5 9L24 12L14.5 15L12 24L9.5 15L0 12L9.5 9Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    case "circle":
      return (
        <>
          <circle cx="12" cy="12" r="10" {...shadow} />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="12"
            cy="12"
            r="6"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle cx="12" cy="12" r="2" fill={stroke} />
        </>
      );
    case "cross":
      return (
        <>
          <path d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z" {...shadow} />
          <path
            d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    case "triangle":
      return (
        <>
          <path d="M12 2L2 22h20L12 2z" {...shadow} />
          <path
            d="M12 2L2 22h20L12 2z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    case "square":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" {...shadow} />
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    case "diamond":
      return (
        <>
          <path d="M12 2L22 12L12 22L2 12Z" {...shadow} />
          <path
            d="M12 2L22 12L12 22L2 12Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    case "ring":
      return (
        <>
          <circle cx="12" cy="12" r="9" {...shadow} />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke={fill}
            strokeWidth={3}
          />
        </>
      );
    case "hexagon":
      return (
        <>
          <path d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5Z" {...shadow} />
          <path
            d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      );
    default:
      return null;
  }
}

function FloatingShapeNode({
  shape,
  reducedMotion,
  bodyWidth,
  bodyHeight,
}: {
  shape: FloatingShape;
  reducedMotion: boolean;
  bodyWidth: number;
  bodyHeight: number;
}) {
  const path = getBodyPath(shape, bodyWidth, bodyHeight);
  const travelDuration = reducedMotion ? shape.duration * 2.5 : shape.duration;

  const visibilityClass = shape.hiddenOnMobile ? "hidden sm:block" : undefined;

  return (
    <motion.div
      className={`absolute left-0 top-0 z-0 will-change-transform ${visibilityClass ?? ""}`}
      style={{
        width: shape.size,
        height: shape.size,
      }}
      initial={{ x: path.x[0], y: path.y[0] }}
      animate={{ x: path.x, y: path.y }}
      transition={{
        x: {
          duration: travelDuration,
          delay: shape.delay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
        y: {
          duration: travelDuration,
          delay: shape.delay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      }}
      aria-hidden
    >
      <motion.div
        className="size-full"
        style={{ rotate: shape.rotation }}
        animate={
          shape.spin
            ? { rotate: [shape.rotation, shape.rotation + 360] }
            : undefined
        }
        transition={
          shape.spin
            ? {
                duration: shape.spinDuration,
                repeat: Infinity,
                ease: "linear",
              }
            : undefined
        }
      >
        <svg viewBox="-4 -4 32 32" className="size-full overflow-visible">
          <NeobrutalistShapeGraphic type={shape.type} fill={shape.fill} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function NeobrutalistPageDecoration({
  shapeCount = 12,
  seed = 2026,
  showRadialGlow = true,
}: NeobrutalistPageDecorationProps) {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);
  const { width: bodyWidth, height: bodyHeight } = useBodySize(bodyRef);
  const shapes = useMemo(
    () => generateShapes(shapeCount, seed),
    [shapeCount, seed],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const canAnimate = bodyWidth > 0 && bodyHeight > 0;

  return (
    <>
      {showRadialGlow ? (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]" />
        </div>
      ) : null}

      <div
        ref={bodyRef}
        className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden select-none"
        aria-hidden
      >
        {mounted && canAnimate
          ? shapes.map((shape) => (
              <FloatingShapeNode
                key={shape.id}
                shape={shape}
                reducedMotion={prefersReducedMotion}
                bodyWidth={bodyWidth}
                bodyHeight={bodyHeight}
              />
            ))
          : null}
      </div>
    </>
  );
}
