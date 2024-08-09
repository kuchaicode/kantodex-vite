import { Button } from '@/components/ui/button';
import { LucideMoon, LucideSun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState<string>('light');

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    };

useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);
    // localstorage check. No more system detect just toggle and persist.
    // Pretty much inserts it into the HTML. That is what Tailwind docs says to do. Because no more next-themes to help with this.

return (
        <Button onClick={toggleTheme} className="bg-rose-600 hover:bg-rose-500 active:bg-rose-800 text-white">
            {theme === 'light' ? <LucideSun /> : <LucideMoon />} 
        </Button>
    );

};

export default ThemeToggle;