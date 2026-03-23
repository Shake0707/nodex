'use client';

import { useEffect, useState, useRef } from 'react';

interface CountUpProps {
    end: number;
    suffix?: string;
    duration?: number;
}

export default function CountUp({ end, suffix = '', duration = 2000 }: CountUpProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = Date.now();

                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // easeOutQuart
                        const eased = 1 - Math.pow(1 - progress, 4);
                        setCount(Math.floor(eased * end));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration]);

    return (
        <span ref={ref} suppressHydrationWarning>
            {count}{suffix}
        </span>
    );
}
