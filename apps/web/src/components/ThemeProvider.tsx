'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('nodex-theme');
        if (stored === 'light' || stored === 'dark') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(stored);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('nodex-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    // Suppress hydration mismatch by rendering children only after mount
    // but we still render the tree to avoid layout shift  
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div data-theme={mounted ? theme : 'dark'} className="contents">
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
