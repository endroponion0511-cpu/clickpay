import React, { useEffect, useState } from 'react';

type Pos = { x: number; y: number };

export function CursorTrail() {
  const [pos, setPos] = useState<Pos | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Включаем эффект только на устройствах с "точным" курсором (десктоп)
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [enabled]);

  if (!enabled || !pos) return null;

  const size = 260; // один большой круг

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div
        className="absolute rounded-full cursor-trail-dot"
        style={{
          left: pos.x - size / 2,
          top: pos.y - size / 2,
          width: size,
          height: size,
        }}
      />
    </div>
  );
}

