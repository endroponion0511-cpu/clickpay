import React, { useEffect, useState } from 'react';

type Point = { id: number; x: number; y: number };

const MAX_POINTS = 12;

export function CursorTrail() {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setPoints((prev) => {
        const next: Point[] = [...prev, { id: Date.now(), x: clientX, y: clientY }];
        if (next.length > MAX_POINTS) next.splice(0, next.length - MAX_POINTS);
        return next;
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 mix-blend-screen">
      {points.map((p, index) => {
        const opacity = (index + 1) / MAX_POINTS;
        const size = 10 + index * 3;
        return (
          <div
            key={p.id}
            className="absolute rounded-full cursor-trail-dot"
            style={{
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}

