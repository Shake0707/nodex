'use client';

import { useEffect, useRef } from 'react';

interface GirihNode {
    x: number;
    y: number;
    phase: number;
    active: boolean;
    pulse: number;
}

const GOLD: [number, number, number] = [201, 168, 76];
const CRIMSON: [number, number, number] = [229, 62, 62];
const VIOLET: [number, number, number] = [124, 58, 237];

function drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    outerR: number, innerR: number,
    points: number,
    rotation = 0,
) {
    const step = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const angle = i * step - Math.PI / 2 + rotation;
        const r = i % 2 === 0 ? outerR : innerR;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

export default function GirihCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let W = 0, H = 0;
        let nodes: GirihNode[] = [];
        let t = 0;

        const SPACING = 110;

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
            buildGrid();
        };

        const buildGrid = () => {
            nodes = [];
            const cols = Math.ceil(W / SPACING) + 2;
            const rows = Math.ceil(H / (SPACING * 0.866)) + 2;

            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    const offset = row % 2 === 0 ? 0 : SPACING * 0.5;
                    const x = col * SPACING + offset;
                    const y = row * SPACING * 0.866;
                    nodes.push({
                        x, y,
                        phase: Math.random() * Math.PI * 2,
                        active: Math.random() < 0.08,
                        pulse: Math.random(),
                    });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            t += 0.008;

            // Draw connections first
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < SPACING * 1.15) {
                        const alpha = (1 - dist / (SPACING * 1.15)) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw stars at each node
            for (const node of nodes) {
                const breathe = Math.sin(t * 0.9 + node.phase) * 0.3 + 0.7;
                const starR = 6;
                const innerR = starR * 0.42;

                if (node.active) {
                    // Active node: gold glow + crimson/violet accent
                    const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, starR * 8);
                    const glowAlpha = (Math.sin(t * 2 + node.phase) * 0.3 + 0.7) * 0.5;
                    const [r, g, b] = node.pulse > 0.5 ? CRIMSON : VIOLET;
                    glow.addColorStop(0, `rgba(${r},${g},${b},${glowAlpha})`);
                    glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, starR * 8, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();

                    // Active star: brighter, gold-white
                    drawStar(ctx, node.x, node.y, starR, innerR, 8, t * 0.15 + node.phase);
                    ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${breathe * 0.9})`;
                    ctx.fill();
                    ctx.strokeStyle = `rgba(255,245,200,${breathe * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                } else {
                    // Passive node: dim Girih star outline
                    const alpha = (breathe * 0.18);
                    drawStar(ctx, node.x, node.y, starR, innerR, 8, node.phase);
                    ctx.strokeStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();

                    // Center dot
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${alpha * 1.8})`;
                    ctx.fill();
                }
            }

            animId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        const onResize = () => resize();
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
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
