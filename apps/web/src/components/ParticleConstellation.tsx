'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    r: number; t: number;
    rgb: [number, number, number];
}

const COUNT = 85;
const CONNECT = 140;
const MOUSE_R = 170;
const FRICTION = 0.91;
const MAX_SPD = 2.8;

export default function ParticleConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let W = 0, H = 0;
        const mouse = { x: -9999, y: -9999 };
        let pts: Particle[] = [];

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };

        const init = () => {
            resize();
            pts = Array.from({ length: COUNT }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r: Math.random() * 1.6 + 0.5,
                t: Math.random() * Math.PI * 2,
                rgb: (Math.random() > 0.5 ? [139, 92, 246] : [6, 182, 212]) as [number, number, number],
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            const rect = canvas.getBoundingClientRect();
            const mx = mouse.x - rect.left;
            const my = mouse.y - rect.top;

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];

                // Organic drift
                p.t += 0.007;
                p.vx += Math.sin(p.t * 0.8) * 0.003;
                p.vy += Math.cos(p.t * 0.6) * 0.003;

                // Mouse repulsion
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_R && dist > 0.5) {
                    const force = (1 - dist / MOUSE_R) * 1.8;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Friction + clamp speed
                p.vx *= FRICTION;
                p.vy *= FRICTION;
                const spd = Math.hypot(p.vx, p.vy);
                if (spd > MAX_SPD) {
                    p.vx = (p.vx / spd) * MAX_SPD;
                    p.vy = (p.vy / spd) * MAX_SPD;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Soft bounce
                if (p.x < 0) { p.x = 0; p.vx *= -0.4; }
                if (p.x > W) { p.x = W; p.vx *= -0.4; }
                if (p.y < 0) { p.y = 0; p.vy *= -0.4; }
                if (p.y > H) { p.y = H; p.vy *= -0.4; }

                const [r, g, b] = p.rgb;

                // Glow aura
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 9);
                grd.addColorStop(0, `rgba(${r},${g},${b},0.45)`);
                grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 9, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
                ctx.fill();

                // Lines to neighbors
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j];
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < CONNECT) {
                        const alpha = (1 - d / CONNECT) * 0.32;
                        const lg = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
                        lg.addColorStop(0, `rgba(139,92,246,${alpha})`);
                        lg.addColorStop(1, `rgba(6,182,212,${alpha})`);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = lg;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        const onResize = () => resize();

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('resize', onResize);

        init();
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
}
