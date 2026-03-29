import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  life: number; // 1 → 0
  decay: number;
}

const COLORS = ['#f9d876', '#6bae3e', '#e05c3a', '#4fc6e0', '#b87de8', '#ff8fab', '#ffffff'];

function spawnBurst(particles: Particle[], cx: number, cy: number) {
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 7;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      life: 1,
      decay: 0.008 + Math.random() * 0.006,
    });
  }
}

interface ConfettiCannonProps {
  /** Increment this to fire a new burst */
  trigger: number;
  /** 1 = single burst, 2 = two staggered bursts */
  bursts?: number;
}

export const ConfettiCannon = ({ trigger, bursts = 1 }: ConfettiCannonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);

  // Resize canvas to match its CSS size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sync = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Fire when trigger increments
  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // First burst immediately
    spawnBurst(particlesRef.current, cx, cy);

    // Optional second burst staggered by 350ms
    let secondTimer: ReturnType<typeof setTimeout> | null = null;
    if (bursts >= 2) {
      secondTimer = setTimeout(() => {
        spawnBurst(particlesRef.current, cx, cy);
      }, 350);
    }

    // Start animation loop if not already running
    if (!animatingRef.current) {
      animatingRef.current = true;
      const tick = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // gravity
          p.vx *= 0.98; // drag
          p.rotation += p.rotationSpeed;
          p.life -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }

        if (particlesRef.current.length > 0) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          animatingRef.current = false;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (secondTimer) clearTimeout(secondTimer);
    };
  }, [trigger, bursts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />
  );
};
